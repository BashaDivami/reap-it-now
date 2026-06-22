# Mock Server — API Overview

This server provides three versioned API namespaces, each backed by flat JSON files.
There is no business logic — controllers only read and write `data/<version>/<resource>.json`.

## Base URL

```
http://localhost:3001/api
```

## Versions

| Prefix      | Purpose                                                        | Source        |
|-------------|----------------------------------------------------------------|---------------|
| `/api/v1/*` | Frontend-used endpoints mirrored exactly from `openapi.yml`    | `openapi.yml` |
| `/api/v2/*` | v1 endpoints that need changes for the frontend (≤ 40% of v1) | Manual        |
| `/api/v3/*` | Net-new endpoints not present in the openapi spec              | Manual        |

## Change log links

- [v1 changes](./v1/CHANGES.md) — what the client spec contains
- [v2 changes](./v2/CHANGES.md) — what was tweaked or removed from v1
- [v3 changes](./v3/CHANGES.md) — what was added for new screens

## Data stores

All data lives in `data/<version>/<resource>.json`.
Each file is a JSON array of objects with an auto-generated `id` (UUID v4).

## Standard response shape

Matches the real `reap-contracts` OpenAPI spec.

```json
// Collection — cursor-based pagination
{ "items": [ ... ], "meta": { "limit": 50, "next": "cursor|null", "prev": "cursor|null", "exactTotal": N } }

// Single item — no envelope
{ "id": "...", "createdAt": "...", ... }

// Error — RFC 7807 Problem Details
{ "title": "Not Found", "status": 404, "detail": "resource not found" }
```

Collections support `?limit` (1–200, default 50) and `?after` (cursor offset).

## What is implemented

### v1 — Endpoints used by the frontend (mirrored from openapi spec)

> See full detail in [docs/v1/CHANGES.md](./v1/CHANGES.md)

| Resource | Endpoints implemented |
|----------|----------------------|
| _(none yet — add rows here as frontend integration begins)_ | |

### v2 — v1 endpoints modified for frontend needs

> See full detail in [docs/v2/CHANGES.md](./v2/CHANGES.md)

| Resource | What changed from v1 |
|----------|----------------------|
| _(none yet)_ | |

### v3 — Net-new endpoints not in the openapi spec

> See full detail in [docs/v3/CHANGES.md](./v3/CHANGES.md)

| Resource | What it does | Screen / feature |
|----------|--------------|-----------------|
| _(none yet)_ | | |

## Generating v1 from openapi.yml

1. Place `openapi.yml` in the project root.
2. Run `npm run generate:v1`.
3. `routes/v1/index.js` and `data/v1/<resource>.json` files are created automatically.
