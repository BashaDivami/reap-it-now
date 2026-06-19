# SDK Generation Pipeline — repeat-now_BE

## Overview

Generates a TypeScript client SDK from the OpenAPI spec and outputs it to `gen/typescript/openapi/public/v1/`. The frontend repo picks up this output and copies it into its vendor folder.

---

## Prerequisites

| Tool | Version | Required for |
|---|---|---|
| Java | 17+ | Running the OpenAPI Generator CLI JAR |
| Node.js | 18+ | Installing SDK dependencies and compiling TypeScript |

---

## How it works

```
openapi/public/v1/openapi.yaml
        ↓  openapi-generator-cli v7.6.0 (via npx)
        ↓  typescript-fetch generator
TypeScript source files generated
        ↓  npm install + npm run build
dist/ compiled output
        ↓
gen/typescript/openapi/public/v1/   ← ready for frontend to copy
```

The generator version is pinned to `7.6.0` via the `OPENAPI_GENERATOR_VERSION` environment variable set inline in the script — no `openapitools.json` needed.

After generation, the script runs `npm install` + `npm run build` inside the output directory to compile TypeScript to JavaScript, then removes `node_modules` and `package-lock.json` leaving only the compiled `dist/`.

---

## Files changed

### `scripts/generate-sdk.mjs` — Added

Runs the OpenAPI Generator CLI against the spec and compiles the output. Uses `npx` to invoke the generator without installing it globally.

Steps performed:
1. Remove existing `gen/typescript/openapi/public/v1/`
2. Run `OPENAPI_GENERATOR_VERSION=7.6.0 npx @openapitools/openapi-generator-cli generate`
   - `-i openapi/public/v1/openapi.yaml`
   - `-g typescript-fetch`
   - `-o gen/typescript/openapi/public/v1/`
   - `--additional-properties npmName=@reap/openapi-public-v1,supportsES6=true,typescriptThreePlus=true`
3. `npm install` inside the output directory
4. `npm run build` → compiles TypeScript → `dist/`
5. Remove `node_modules/` and `package-lock.json`

---

### `package.json` — Modified

Added the `generate:sdk` script and the `@openapitools/openapi-generator-cli` dev dependency.

```json
"generate:sdk": "node scripts/generate-sdk.mjs"

"devDependencies": {
  "@openapitools/openapi-generator-cli": "^2.x"
}
```

---

### `.gitignore` — Modified

Added `/gen/` so the generated SDK files are never committed. They are regenerated on demand.

```
# Auto-generated TypeScript SDK — run `npm run generate:sdk` to regenerate
/gen/
```

---

## Commands

| Command | Description |
|---|---|
| `npm run generate:sdk` | Generates the TypeScript SDK from the OpenAPI spec and builds it. Output lands in `gen/typescript/openapi/public/v1/`. Run this whenever the spec changes. |

---

## When to run

Run `npm run generate:sdk` when:

- The OpenAPI spec (`openapi/public/v1/openapi.yaml`) has changed
- A new developer sets up the project for the first time
- The frontend reports SDK type errors or missing API methods

> After regenerating, go to the frontend repo and run `npm run sync:sdk` to copy the new SDK into `vendor/`.
