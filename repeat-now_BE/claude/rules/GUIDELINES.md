# Mock Server — Development Guidelines

These rules apply to every change made in this repository.
Read them before adding any route, endpoint, or data file.

---

## 1. No business logic

Controllers only read from or write to a JSON file.
They must not validate domain rules, transform data for display, or call external services.
If logic is needed, it belongs in the real backend — not here.

---

## 2. Version discipline

### v1 — Frontend-used endpoints from openapi.yml (do not modify)
- Only include endpoints that are **actually consumed by the frontend** — do not expose the full spec.
- Each endpoint must mirror `openapi.yml` exactly — same path, method, request, and response shape.
- Do not hand-edit v1 routes. If an endpoint needs a change for the UI, move it to v2.

### v2 — Modified v1 endpoints (≤ 40% of v1 surface)
- Only endpoints that exist in v1 but **need changes** to work correctly in the frontend.
- Unchanged endpoints stay in v1 — do not duplicate them here.
- Budget: at most 40% of v1 endpoints may appear in v2.
- Document every tweak in `docs/v2/CHANGES.md`.

### v3 — Net-new endpoints (not in openapi.yml)
- Only endpoints that **do not exist** in the openapi spec at all.
- Must be tied to a specific screen or feature.
- Do not add speculative endpoints; confirm with the team first.
- Document every new endpoint in `docs/v3/CHANGES.md`.

---

## 3. Documentation is mandatory

Document every change **as you implement it** — not after.
`docs/OVERVIEW.md` is the common index — keep its endpoint counts in sync too.

| Change | File to update | What to write |
|--------|---------------|---------------|
| Frontend starts using a v1 endpoint | `docs/v1/CHANGES.md` — **Frontend Active Usage** table | Method, path, screen/feature name |
| v2 tweak added | `docs/v2/CHANGES.md` — Endpoints table | Method, path, what changed, why |
| v3 endpoint added | `docs/v3/CHANGES.md` — Endpoints table | Method, path, screen/feature, description |
| Any of the above | `docs/OVERVIEW.md` — Version Summary table | Update the endpoint count for that version |

---

## 4. OpenAPI spec → SDK → frontend sync

Any change to routes or schemas must flow through the full pipeline below.
Skipping a step leaves the frontend using stale types.

### When to run this pipeline

- You add an endpoint (any version)
- You change a request/response schema
- You rename a path parameter or query field

### The pipeline

```
1. Edit openapi/public/v1/openapi.yaml   (source of truth for local dev)
         ↓
2. npm run generate:sdk                  (in repeat-now_BE)
   → regenerates gen/typescript/openapi/public/v1/
         ↓
3. npm run sync:sdk                      (in repeat-now/reapitnow.ai)
   → copies SDK into vendor/openapi-public-v1/
         ↓
4. Frontend TypeScript picks up new types on next tsc / vite build
```

> **Why this matters:** The frontend's `sync-sdk.mjs` resolves the SDK from
> `repeat-now_BE` via `REAP_CONTRACTS_PATH=../../repeat-now_BE` in `.env.local`.
> The generated `gen/` folder is the bridge — it must be rebuilt after every spec edit.

### v2 / v3 changes

- **v2 tweaks** — still modify `openapi/public/v1/openapi.yaml` (same spec file).
  The tweak lives in `routes/v2/` but the contract stays in the spec.
- **v3 new endpoints** — add them to `openapi/public/v1/openapi.yaml` under the
  correct path, then run the pipeline. Also document in `docs/v3/CHANGES.md`.

---

## 5. Data files

One JSON file per controller, following `data/<version>/<resource>.json`.
Each file is a JSON **array** of objects. Every object has an `id` field (UUID v4).

| Version | Rule |
|---------|------|
| v1 | One file per domain — all 32 already exist under `data/v1/`. Do not delete or rename them. |
| v2 | **Only create** `data/v2/<resource>.json` if the data shape genuinely differs from v1. Otherwise the v2 controller reads directly from `data/v1/<resource>.json`. |
| v3 | **Always create** `data/v3/<resource>.json` when a new endpoint is added — seed it with `[]` or representative data. |

- Seed data can be added manually; `makeController` will not overwrite existing files.
- Do not put sensitive or real user data in these files.

---

## 6. Response shape

All endpoints must return one of the following shapes, matching the real contract:

```json
// Collection — cursor-based pagination
{ "items": [ ... ], "meta": { "limit": N, "next": "cursor|null", "prev": "cursor|null", "exactTotal": N } }

// Single item — no envelope, return the object directly
{ "id": "...", "createdAt": "...", ... }

// Error — RFC 7807 Problem Details
{ "title": "Not Found", "status": 404, "detail": "resource not found" }
```

Collections support `?limit` (1–200, default 50) and `?after` (cursor offset).
Do not use `data`, `total`, or bare `message` wrappers.

---

## 7. Resource naming reference

When wiring up a route, use the resource name exactly as it appears in the OpenAPI spec.
This table is a **naming reference only** — only implement what the frontend actually needs.

| Resource name | URL pattern in spec |
|---------------|---------------------|
| `auth` | `/auth/*` and `/orgs/:orgId/auth/policy` |
| `orgs` | `/orgs` and `/orgs/:orgId` |
| `api-keys` | `/orgs/:orgId/api-keys` |
| `audit` | `/orgs/:orgId/audit/events` |
| `aws` | `/orgs/:orgId/aws/*` |
| `chat` | `/orgs/:orgId/chat/*` |
| `connector-clusters` | `/orgs/:orgId/connector-clusters` |
| `connectors` | `/orgs/:orgId/connectors` |
| `credential-assignments` | `/orgs/:orgId/credential-assignments` |
| `credential-stores` | `/orgs/:orgId/credential-stores` |
| `credentials` | `/orgs/:orgId/credentials` |
| `dashboards` | `/orgs/:orgId/dashboards/*` |
| `delegations` | `/orgs/:orgId/delegations/*` and `/msp/delegations/*` |
| `devices` | `/orgs/:orgId/devices` |
| `discovery` | `/orgs/:orgId/discovery/*` |
| `endpoints` | `/orgs/:orgId/endpoints` |
| `files` | `/orgs/:orgId/files` |
| `grafana` | `/orgs/:orgId/grafana/*` |
| `idp` | `/orgs/:orgId/idp/connections` |
| `integrations` | `/orgs/:orgId/integrations/*` |
| `invitations` | `/orgs/:orgId/invitations` |
| `knowledge` | `/orgs/:orgId/knowledge/*` |
| `memberships` | `/orgs/:orgId/memberships` |
| `metrics` | `/orgs/:orgId/metrics/*` |
| `msp` | `/msp/*` |
| `roles` | `/orgs/:orgId/roles` |
| `runbooks` | `/orgs/:orgId/runbooks/*` |
| `secrets` | `/orgs/:orgId/secrets` |
| `signals` | `/orgs/:orgId/signals/*` |
| `sites` | `/orgs/:orgId/sites` |
| `topology` | `/orgs/:orgId/topology/*` |
| `visibility` | `/orgs/:orgId/visibility/*` |

---

## 8. Adding a new resource

1. Choose the correct version (v1/v2/v3) per the rules above.
2. Create `data/<version>/<resource>.json` with `[]` or seed data.
3. Add routes using `makeController('<version>', '<resource>')` in the version's `index.js`.
4. Use the resource name from the table in §7 — do not invent new names.
5. Add a row to `docs/<version>/CHANGES.md` (see §3 for what to write).
6. Update the endpoint count in `docs/OVERVIEW.md` — Version Summary table.

---

## Summary decision tree

```
Is the endpoint in openapi/public/v1/openapi.yaml?
  YES → Does it work as-is for the UI?
          YES → implement in v1 (no change needed)
          NO  → tweak it in v2 (within 40% budget)
  NO  → Is it a new screen or feature?
          YES → add to v3, update openapi.yaml, run pipeline (§4)
          NO  → do not add it yet; confirm with team

After ANY spec change → run the SDK pipeline (§4):
  npm run generate:sdk   (in repeat-now_BE)
  npm run sync:sdk       (in repeat-now/reapitnow.ai)
```
