# repeat-now Mock Server

JSON-backed mock API server for the REAP frontend. No database, no business logic — just flat JSON files and Express routes that mirror the OpenAPI contract.

## Quick start

```bash
npm install
npm run dev        # starts on http://localhost:3001/api (hot-reload via nodemon)
```

Copy `.env.example` to `.env` to override the default port:

```bash
cp .env.example .env
```

## API versions

| Prefix | Purpose |
|--------|---------|
| `/api/v1/*` | All 234 endpoints from `openapi/public/v1/openapi.yaml`, mirrored exactly |
| `/api/v2/*` | v1 endpoints tweaked for the frontend |
| `/api/v3/*` | Net-new endpoints not in the spec, tied to specific screens |
| `/api/health` | Health check |

## Data

All data lives in `data/<version>/<resource>.json` — flat JSON arrays.  
`makeController` in `lib/makeController.js` auto-assigns `id` (UUID v4), `createdAt`, `updatedAt`, `createdBy`, `updatedBy` on create/update.

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start with hot-reload |
| `npm start` | Start without hot-reload |
| `npm run generate:v1` | Regenerate `routes/v1/index.js` and seed `data/v1/` from the OpenAPI spec |
| `npm run generate:sdk` | Regenerate TypeScript SDK in `gen/typescript/openapi/public/v1/` |

## SDK sync pipeline

After any spec or schema change:

```bash
# 1. Edit openapi/public/v1/openapi.yaml
# 2. Regenerate the SDK
npm run generate:sdk

# 3. Sync to frontend (run from repeat-now/reapitnow.ai)
npm run sync:sdk
```

See `claude/rules/GUIDELINES.md` §4 for full details.

## Documentation

- `docs/OVERVIEW.md` — common index, version summary, endpoint counts
- `docs/v1/CHANGES.md` — full v1 endpoint list + frontend active usage tracker
- `docs/v2/CHANGES.md` — v2 tweaks (what changed and why)
- `docs/v3/CHANGES.md` — v3 new endpoints (what screen they serve)
