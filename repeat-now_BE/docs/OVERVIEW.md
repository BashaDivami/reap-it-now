# Mock Server — API Overview

Single source of truth for what is implemented across all three API versions.
Update this file whenever endpoints are added or changed in any version.

---

## Base URL

```
http://localhost:3001/api
```

---

## Version Summary

| Version | Purpose | Endpoint count | Detail |
|---------|---------|---------------|--------|
| `/api/v1/*` | All client-spec endpoints, mirrored exactly from `openapi.yaml` | 234 | [v1/CHANGES.md](./v1/CHANGES.md) |
| `/api/v2/*` | v1 endpoints tweaked for frontend needs |  | [v2/CHANGES.md](./v2/CHANGES.md) |
| `/api/v3/*` | Net-new endpoints not in the spec, tied to specific screens | 0 | [v3/CHANGES.md](./v3/CHANGES.md) |

> Update the counts in the table above whenever you add rows to a CHANGES.md file.

---

## SDK sync pipeline

Any spec change must flow through:

```
1. Edit openapi/public/v1/openapi.yaml
2. npm run generate:sdk          (repeat-now_BE)
3. npm run sync:sdk              (repeat-now/reapitnow.ai)
```

See [GUIDELINES §4](../claude/rules/GUIDELINES.md) for full details.

---

## Standard response shapes

```json
// Collection — cursor-based pagination
{ "items": [...], "meta": { "limit": 50, "next": "cursor|null", "prev": "cursor|null", "exactTotal": N } }

// Single item — no envelope
{ "id": "...", "createdAt": "...", ... }

// Error — RFC 7807 Problem Details
{ "title": "Not Found", "status": 404, "detail": "resource not found" }
```

Collections support `?limit` (1–200, default 50) and `?after` (cursor offset).

---

## Data stores

All data lives in `data/<version>/<resource>.json` — flat JSON arrays, no business logic.
Each object has an auto-generated `id` (UUID v4) assigned by `makeController.create`.

---

## Decision: which version does a new endpoint belong in?

```
Is the endpoint in openapi/public/v1/openapi.yaml?
  YES → Does it work as-is for the UI?
          YES → implement in v1 (no change needed)
          NO  → tweak it in v2
  NO  → Is it for a new screen or feature?
          YES → add to v3, update openapi.yaml, run SDK pipeline
          NO  → do not add it; confirm with team first
```

---

## Per-version detail

- **[v1/CHANGES.md](./v1/CHANGES.md)** — full endpoint list (234 routes across 32 domains) + frontend active usage tracker
- **[v2/CHANGES.md](./v2/CHANGES.md)** — endpoints tweaked from v1 (what changed and why)
- **[v3/CHANGES.md](./v3/CHANGES.md)** — net-new endpoints (what screen they serve)
