import { execSync } from 'node:child_process';
import { rm, unlink, readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const specPath = path.join(projectRoot, 'openapi', 'public', 'v1', 'openapi.yaml');
const outDir = path.join(projectRoot, 'gen', 'typescript', 'openapi', 'public', 'v1');
const npmName = '@reap/openapi-public-v1';

const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: projectRoot });

// Fix known bugs produced by the typescript-fetch generator:
//   1. Discriminant comparisons use bare identifiers instead of string literals
//      e.g.  value['type'] !== org  →  value['type'] !== 'org'
//   2. Discriminated-union files append lowercase 'schema' to imported names
//      e.g.  ChatChoiceResponseBlockschema  →  ChatChoiceResponseBlock
//   3. Generator emits ERRORUNKNOWN placeholder for unresolvable discriminants
async function patchGeneratedModels(modelsDir) {
  const files = (await readdir(modelsDir)).filter(f => f.endsWith('.ts'));

  for (const file of files) {
    const filePath = path.join(modelsDir, file);
    let src = await readFile(filePath, 'utf8');
    const original = src;

    // Fix 1: unquoted string discriminants  (value['x'] !== foo  →  value['x'] !== 'foo')
    src = src.replace(
      /\bvalue\[(['"])\w+\1\]\s*!==\s*([a-zA-Z_]\w*)\b(?!\s*[.([])/g,
      (match, _q, name) => match.replace(`!== ${name}`, `!== '${name}'`),
    );

    // Fix 2: imported-name + spurious lowercase 'schema' suffix
    // Collect every name that IS actually imported in this file
    const importedNames = new Set();
    for (const m of src.matchAll(/import\s+(?:type\s+)?\{([^}]+)\}/g)) {
      for (const name of m[1].split(',').map(s => s.trim()).filter(Boolean)) {
        importedNames.add(name);
      }
    }
    // For each imported name, replace 'Nameschema' → 'Name' everywhere it appears
    for (const name of importedNames) {
      const buggy = `${name}schema`;
      if (src.includes(buggy)) {
        src = src.replaceAll(buggy, name);
      }
    }

    // Fix 3: ERRORUNKNOWN placeholder — remove from union type and switch cases
    src = src.replace(/ \| \{ type: '' \} & ERRORUNKNOWN/g, '');
    src = src.replace(/\s*case '':\s*\n\s*return Object\.assign\(\{\}, ERRORUNKNOWN\w+\(.*?\), \{[^}]+\} as const\);\s*\n/g, '\n');

    if (src !== original) {
      await writeFile(filePath, src, 'utf8');
    }
  }
}

async function generate() {
  console.log('[generate-sdk] Removing existing output…');
  await rm(outDir, { recursive: true, force: true });

  console.log('[generate-sdk] Generating TypeScript SDK from spec…');
  run(
    `OPENAPI_GENERATOR_VERSION=7.6.0 npx @openapitools/openapi-generator-cli generate \
      -i "${specPath}" \
      -g typescript-fetch \
      -o "${outDir}" \
      --additional-properties=npmName=${npmName},supportsES6=true,typescriptThreePlus=true`
  );

  await unlink(path.join(outDir, '.gitignore')).catch(() => {});

  console.log('[generate-sdk] Patching known generator template bugs…');
  await patchGeneratedModels(path.join(outDir, 'src', 'models'));

  console.log('[generate-sdk] Installing SDK dependencies…');
  run(`npm install --no-audit --no-fund --prefer-offline --prefix "${outDir}"`);

  console.log('[generate-sdk] Building TypeScript…');
  run(`npm run build --prefix "${outDir}"`);

  console.log('[generate-sdk] Cleaning up…');
  await rm(path.join(outDir, 'node_modules'), { recursive: true, force: true });
  await rm(path.join(outDir, 'package-lock.json'), { force: true });

  console.log(`[generate-sdk] ✅ SDK ready at gen/typescript/openapi/public/v1`);
}

generate().catch((err) => {
  console.error('[generate-sdk] Failed:', err.message);
  process.exitCode = 1;
});
