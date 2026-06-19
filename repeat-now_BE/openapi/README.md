# REAP OpenAPI Contracts

This directory holds the HTTP surface area contracts that complement the gRPC/proto files in this repo. Specs are grouped first by audience, then by version so parallel surfaces can evolve independently.

```
openapi/
  admin/
    v1/
      openapi.yaml   # canonical source
      openapi.json   # machine-friendly build artifact
      schemas/       # JSON Schema fragments referenced from the spec
      docs/          # generated Redoc bundle (`redoc.html`)
  public/
    v1/
      openapi.yaml   # canonical source
      openapi.json   # machine-friendly build artifact
      schemas/       # JSON Schema fragments referenced from the spec
      docs/          # generated Redoc bundle (`redoc.html`)
```

## Conventions
- Treat `openapi.yaml` as the single source of truth; `make openapi` will render the JSON and docs directly from this file.
- Keep JSON Schemas in `schemas/` grouped with the spec version that references them.
- When new surfaces (e.g. `admin`) or versions (`v2`) are added, copy the directory scaffold under `openapi/<surface>/<version>/`.
- Run any validation or bundling steps in CI to ensure YAML, JSON, and schema references stay in sync.

## Documentation
The `docs/` folder is intentionally lightweight. If you adopt generated reference docs (e.g. Redoc, Stoplight, Slate), emit them per surface/version in this folder or publish them via CI artifacts.

Run `make openapi` (or the more granular `make openapi-json` / `make openapi-docs`) from the repo root to regenerate `openapi.json` and the Redoc HTML bundle. The docs target invokes `redocly/cli` in Docker, so only `docker` is required locally. Surface/version can be overridden via `OPENAPI_SURFACE` and `OPENAPI_VERSION` variables when needed.
