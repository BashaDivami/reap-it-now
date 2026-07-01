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

### v2 — Modified v1 endpoints
- Only endpoints that exist in v1 but **need changes** to work correctly in the frontend.
- Unchanged endpoints stay in v1 — do not duplicate them here.
- If a v1 path needs any change for the frontend to work, it belongs in v2 — full stop.
- Document every tweak in `docs/v2/CHANGES.md`.
- **If the path already exists in `openapi/public/v1/openapi.yaml`, it MUST go in v2 — never v3.** This includes cases where the response shape is wrong, required params need to become optional, status codes differ, or the mock behavior needs to be overridden. The path existing in the spec is the deciding factor, not the size of the change.

### v3 — Net-new endpoints (not in openapi.yml)
- Only endpoints whose **path does not exist anywhere in `openapi/public/v1/openapi.yaml`**.
- Must be tied to a specific screen or feature.
- Do not add speculative endpoints; confirm with the team first.
- Document every new endpoint in `docs/v3/CHANGES.md`.
- **Do not use v3 for an existing spec path that needs tweaks — that is v2.**

---

## 3. Documentation is mandatory

Document every change **as you implement it** — not after.
`docs/OVERVIEW.md` is the common index — keep its endpoint counts in sync too.

| Change | File to update | What to write |
|--------|---------------|---------------|
| Frontend starts using a v1 endpoint | `docs/v1/CHANGES.md` — **Frontend Active Usage** table | Method, path, screen/feature name |
| v2 tweak added | `docs/v2/CHANGES.md` — Endpoints section | Full endpoint block (see template below) |
| v3 endpoint added | `docs/v3/CHANGES.md` — Endpoints section | Full endpoint block (see template below) |
| Any of the above | `docs/OVERVIEW.md` — Version Summary table | Update the endpoint count for that version |

### Documentation template — required for every v2 and v3 endpoint

Every endpoint added to `docs/v2/CHANGES.md` or `docs/v3/CHANGES.md` must use this full block. A one-line table row is not acceptable.

~~~markdown
### METHOD /path/to/endpoint

**Screen / Feature:** Name of the screen or feature that uses this endpoint

**Description:** What this endpoint does and why it exists.

**Path parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `orgId` | string (UUID) | Yes | Organisation ID |
| `resourceId` | string (UUID) | Yes | Resource ID |

**Query parameters**

| Parameter | Type | Required | Default | Allowed values | Description |
|-----------|------|----------|---------|----------------|-------------|
| `timeframe` | string | No | `7D` | `1D`, `7D`, `14D`, `30D` | Time window for the data |
| `limit` | integer | No | `50` | 1–200 | Maximum items to return |

**Request body** *(mutations only — omit for GET)*

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Display name |
| `status` | string | No | One of: `draft`, `published` |

**Response**

Shape: single object / collection `{ items, meta }` *(pick one)*

| Field | Type | Description |
|-------|------|-------------|
| `timeframe` | string | Echoes the requested timeframe |
| `kpis` | array | KPI metric objects (see below) |
| `kpis[].id` | string | Metric identifier |
| `kpis[].label` | string | Display label |
| `kpis[].value` | string | Pre-formatted value with unit (e.g. `"3.4h"`, `"79%"`) |
| `kpis[].trend.percent` | number | Change magnitude vs previous period |
| `kpis[].trend.direction` | `"up"` \| `"down"` | Direction of change |
| `kpis[].trend.improving` | boolean | Whether the change is desirable |
| `kpis[].health` | `"good"` \| `"borderline"` \| `"poor"` | Health band |
| `kpis[].tooltip` | string | Tooltip explanation text |

**Data file:** `data/<version>/<resource>.json`

**Controller:** `routes/<version>/controllers/<resource>.controller.js`
~~~

Omit sections that do not apply (e.g. omit **Request body** for GET endpoints, omit **Query parameters** if there are none). Do not leave placeholder text — fill every field with real values.

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

### Seed data sourcing (priority order)

When creating `data/v2/<resource>.json` or `data/v3/<resource>.json`, use this order to source the seed data:

1. **Check the frontend component first** — if the component or `src/mocks/data/` already has stub/mock data for this resource, copy it directly into the backend JSON file. It already has the correct shape and realistic values — do not invent data from scratch when a stub exists.
2. **Fallback to `openapi.yaml`** — if no frontend stub exists, craft representative data manually that matches the schema defined in the spec.

> `src/mocks/data/` files in the frontend are NOT deleted after migration — they remain as test fixtures for unit tests only.

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

### Route structure (mandatory for all versions)

Every version follows the same structure as v1 — handler logic lives in a controller file, `index.js` only mounts routes:

```
routes/
├── v1/
│   ├── controllers/<domain>.controller.js   ← handler logic here
│   └── index.js                             ← mounts routes only, no inline handlers
├── v2/
│   ├── controllers/<domain>.controller.js   ← handler logic here
│   └── index.js                             ← mounts routes only, no inline handlers
└── v3/
    ├── controllers/<domain>.controller.js   ← handler logic here
    └── index.js                             ← mounts routes only, no inline handlers
```

**Never write inline handler functions in `index.js`.** Every handler belongs in its own controller file.

- For standard CRUD (v1/v2): use `makeController('<version>', '<resource>')` in the controller file, export it, and mount it in `index.js`.
- For custom logic (v2 tweaks, v3 net-new): write named handler functions in the controller file, export them, and mount in `index.js`.

**v1 controller pattern (standard CRUD):**
```js
// routes/v1/controllers/signals.controller.js
'use strict';
const makeController = require('../../../lib/makeController');
module.exports = makeController('v1', 'signals');
```
```js
// routes/v1/index.js
const signalsCtrl = require('./controllers/signals.controller');
router.get('/orgs/:orgId/signals/incidents', signalsCtrl.getAll);
```

**v2/v3 controller pattern (custom logic):**
```js
// routes/v3/controllers/analytics.controller.js
'use strict';
const { read } = require('../../../lib/jsonStore');
exports.getSummary = (req, res) => { ... };
```
```js
// routes/v3/index.js
const analyticsCtrl = require('./controllers/analytics.controller');
router.get('/orgs/:orgId/analytics/summary', analyticsCtrl.getSummary);
```

### Steps to add a new resource

1. Choose the correct version (v1/v2/v3) per the rules above.
2. Create `data/<version>/<resource>.json` with `[]` or seed data.
3. Create `routes/<version>/controllers/<resource>.controller.js` with the handler logic.
4. Mount the controller in `routes/<version>/index.js` — one line per route, no inline logic.
5. Use the resource name from the table in §7 — do not invent new names.
6. Add a row to `docs/<version>/CHANGES.md` (see §3 for what to write).
7. Update the endpoint count in `docs/OVERVIEW.md` — Version Summary table.
8. **Update `openapi/public/v1/openapi.yaml`** with the new or modified path, then run the full SDK pipeline (see §4). This applies to v2 tweaks and v3 new endpoints — the spec is always the source of truth regardless of which version the mock route lives in.

---

## Summary decision tree

```
Is the PATH in openapi/public/v1/openapi.yaml?
  YES → Does it work as-is for the UI?
          YES → use v1, no change needed
          NO  → tweak it in v2
                NEVER create a new path in v3 for an existing spec path
                Changes allowed in v2: response shape, optional params,
                status codes, mock behavior override
  NO  → Is it for a specific screen or feature?
          YES → add to v3 + update openapi.yaml + run pipeline (§4)
          NO  → do not add it; confirm with team first

After ANY change to routes or openapi.yaml → run the SDK pipeline (§4):
  npm run generate:sdk   (in repeat-now_BE)
  npm run sync:sdk       (in repeat-now/reapitnow.ai)
```
