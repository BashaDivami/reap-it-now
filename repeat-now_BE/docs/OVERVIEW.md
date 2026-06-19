# Mock Server — API Overview

This server provides three versioned API namespaces, each backed by flat JSON files.
There is no business logic — controllers only read and write `data/<version>/<resource>.json`.

## Base URL

```
http://localhost:3001/api
```

## Versions

| Prefix      | Purpose                                               | Source              |
|-------------|-------------------------------------------------------|---------------------|
| `/api/v1/*` | Client-provided APIs, mirrored exactly from spec      | `openapi.yml`       |
| `/api/v2/*` | Modified/removed client APIs (≤ 40% delta from v1)   | Manual              |
| `/api/v3/*` | Net-new APIs added for screens not in client spec     | Manual              |

## Change log links

- [v1 changes](./v1/CHANGES.md) — what the client spec contains
- [v2 changes](./v2/CHANGES.md) — what was tweaked or removed from v1
- [v3 changes](./v3/CHANGES.md) — what was added for new screens

## Data stores

All data lives in `data/<version>/<resource>.json`.
Each file is a JSON array of objects with an auto-generated `id` (UUID v4).

## Standard response shape

```json
// Collection
{ "data": [ ... ], "total": N }

// Single item
{ "data": { ... } }

// Error
{ "message": "..." }
```

## Generating v1 from openapi.yml

1. Place `openapi.yml` in the project root.
2. Run `npm run generate:v1`.
3. `routes/v1/index.js` and `data/v1/<resource>.json` files are created automatically.
