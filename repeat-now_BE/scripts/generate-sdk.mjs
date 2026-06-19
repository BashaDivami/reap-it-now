import { execSync } from 'node:child_process';
import { rm, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const specPath = path.join(projectRoot, 'openapi', 'public', 'v1', 'openapi.yaml');
const outDir = path.join(projectRoot, 'gen', 'typescript', 'openapi', 'public', 'v1');
const npmName = '@reap/openapi-public-v1';

const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: projectRoot });

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
