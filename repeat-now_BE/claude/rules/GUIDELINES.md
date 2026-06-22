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
- Removed endpoints return `410 Gone` with a descriptive message.
- Budget: at most 40% of v1 endpoints may appear in v2.

### v3 — Net-new endpoints (not in openapi.yml)
- Only endpoints that **do not exist** in the openapi spec at all.
- Must be tied to a specific screen or feature — document in `docs/v3/CHANGES.md`.
- Do not add speculative endpoints; confirm with the team first.

---

## 3. Documentation is mandatory

Every change must be reflected in the corresponding changes file **before the PR is merged**:

| Change type        | File to update              |
|--------------------|-----------------------------|
| v1 spec re-gen     | `docs/v1/CHANGES.md`        |
| v2 tweak / removal | `docs/v2/CHANGES.md`        |
| v3 new endpoint    | `docs/v3/CHANGES.md`        |
| Any version change | `docs/OVERVIEW.md` if scope changes |

---

## 4. Data files

- `data/<version>/<resource>.json` is a JSON **array** of objects.
- Every object has an `id` field (UUID v4, assigned by `makeController.create`).
- Seed data can be added manually; the generator will not overwrite existing files.
- Do not put sensitive or real user data in these files.

---

## 5. Response shape

All endpoints must return one of the following shapes, matching the real contract:

```json
// Collection — cursor-based pagination
{ "items": [ ... ], "meta": { "limit": N, "next": "cursor|null", "prev": "cursor|null", "exactTotal": N } }

// Single item — no envelope, return the object directly
{ "id": "...", "createdAt": "...", ... }

// Error — RFC 7807 Problem Details
{ "title": "Not Found", "status": 404, "detail": "resource not found" }

// Removed endpoint (v2 only)
HTTP 410 Gone  +  { "title": "Gone", "status": 410, "detail": "Removed in v2: <reason>" }
```

Collections support `?limit` (1–200, default 50) and `?after` (cursor offset).
Do not use `data`, `total`, or bare `message` wrappers.

---

## 6. Resource names and route patterns

All resource names come from the OpenAPI spec at `openapi/public/v1/openapi.yaml`.
Use the exact same names when calling `makeController('<version>', '<resource>')`.

### URL pattern
```
/api/v1/auth/*                                  — authentication
/api/v1/orgs/:orgId/<resource>                  — org-scoped resource
/api/v1/orgs/:orgId/<resource>/:id              — single item
/api/v1/msp/*                                   — MSP / delegations
```

### Available resources (from openapi spec)

| Resource name (use in makeController) | URL prefix | Endpoints |
|---------------------------------------|------------|-----------|
| `auth` | `/auth/*` | 15 |
| `orgs` | `/orgs` | 2 |
| `api-keys` | `/orgs/:orgId/api-keys` | 2 |
| `audit` | `/orgs/:orgId/audit/events` | 2 |
| `chat` | `/orgs/:orgId/chat/*` | 16 |
| `connector-clusters` | `/orgs/:orgId/connector-clusters` | 4 |
| `connectors` | `/orgs/:orgId/connectors` | 3 |
| `credential-assignments` | `/orgs/:orgId/credential-assignments` | 2 |
| `credential-stores` | `/orgs/:orgId/credential-stores` | 2 |
| `credentials` | `/orgs/:orgId/credentials` | 2 |
| `dashboards` | `/orgs/:orgId/dashboards/*` | 4 |
| `devices` | `/orgs/:orgId/devices` | 8 |
| `discovery` | `/orgs/:orgId/discovery/*` | 6 |
| `endpoints` | `/orgs/:orgId/endpoints` | 2 |
| `files` | `/orgs/:orgId/files` | 2 |
| `grafana` | `/orgs/:orgId/grafana/*` | 1 |
| `idp` | `/orgs/:orgId/idp/connections` | 4 |
| `integrations` | `/orgs/:orgId/integrations/*` | 15 |
| `invitations` | `/orgs/:orgId/invitations` | 3 |
| `knowledge` | `/orgs/:orgId/knowledge/*` | 7 |
| `memberships` | `/orgs/:orgId/memberships` | 2 |
| `metrics` | `/orgs/:orgId/metrics/*` | 2 |
| `msp` | `/msp/*` | 3 |
| `roles` | `/orgs/:orgId/roles` | 2 |
| `runbooks` | `/orgs/:orgId/runbooks/*` | 9 |
| `secrets` | `/orgs/:orgId/secrets` | 3 |
| `signals` | `/orgs/:orgId/signals/*` | 8 |
| `sites` | `/orgs/:orgId/sites` | 4 |
| `topology` | `/orgs/:orgId/topology/*` | 10 |
| `visibility` | `/orgs/:orgId/visibility/*` | 9 |

Only add a resource here if the frontend actually uses it. Do not expose all 162 endpoints by default.

---

## 7. Adding a new resource

1. Choose the correct version (v1/v2/v3) per the rules above.
2. Create `data/<version>/<resource>.json` with `[]` or seed data.
3. Add routes using `makeController('<version>', '<resource>')` in the version's `index.js`.
4. Use the resource name from the table in §6 — do not invent new names.
5. Update the corresponding `docs/<version>/CHANGES.md`.

---

## 8. Removing or deprecating an endpoint (v2 only)

```js
router.delete('/orgs/:orgId/resource/:id', (req, res) =>
  res.status(410).json({ title: 'Gone', status: 410, detail: 'Removed in v2: <reason>' }));
```

Never hard-delete a v1 route — express it as 410 in v2.

---

## Summary decision tree

```
Is the endpoint in openapi/public/v1/openapi.yaml?
  YES → Does it work as-is for the UI?
          YES → use v1 (no change needed)
          NO  → tweak it in v2 (within 40% budget)
  NO  → Is it for a new screen?
          YES → add to v3
          NO  → do not add it yet; confirm with team
```
