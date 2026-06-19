import { execSync } from 'node:child_process';
import { rm, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const specPath = 'openapi/public/v1/openapi.yaml';
const outDir = 'gen/typescript/openapi/public/v1';
const npmName = '@reap/openapi-public-v1';
const generatorImage = 'openapitools/openapi-generator-cli:v7.6.0';
const nodeImage = 'node:20';

const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: projectRoot });

async function generate() {
  console.log('[generate-sdk] Removing existing output…');
  await rm(path.join(projectRoot, outDir), { recursive: true, force: true });

  console.log('[generate-sdk] Generating TypeScript SDK from spec…');
  run(
    `docker run --rm \
      -v "${projectRoot}:/local" \
      ${generatorImage} generate \
      -i /local/${specPath} \
      -g typescript-fetch \
      -o /local/${outDir} \
      --additional-properties=npmName=${npmName},supportsES6=true,typescriptThreePlus=true`
  );

  // Remove the .gitignore the generator writes — we manage ignores ourselves
  await unlink(path.join(projectRoot, outDir, '.gitignore')).catch(() => {});

  console.log('[generate-sdk] Building TypeScript…');
  run(
    `docker run --rm \
      -v "${projectRoot}:/workspace" \
      -w /workspace/${outDir} \
      ${nodeImage} /bin/sh -c \
      "set -eu; npm install --no-audit --no-fund --prefer-offline; npm run build; rm -rf node_modules package-lock.json"`
  );

  console.log(`[generate-sdk] ✅ SDK ready at ${outDir}`);
}

generate().catch((err) => {
  console.error('[generate-sdk] Failed:', err.message);
  process.exitCode = 1;
});
