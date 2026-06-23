# v3 — New Screen APIs

Endpoints here did **not exist** in the client spec (`openapi/public/v1/openapi.yaml`).
They were added because a screen needed data not available in v1 or v2.

See [GUIDELINES §2](../../claude/rules/GUIDELINES.md) for when to use v3.

---

## Endpoints

| Method | Path | Screen / Feature | Description |
|--------|------|-----------------|-------------|
| — | — | — | _(no v3 endpoints yet)_ |

---

## How to add a v3 endpoint

1. Add the path to `openapi/public/v1/openapi.yaml` and run the SDK pipeline ([GUIDELINES §4](../../claude/rules/GUIDELINES.md)).
2. Add the route to `routes/v3/index.js` using `makeController('v3', '<resource>')`.
3. Create `data/v3/<resource>.json` with seed data.
4. Add a row to the table above — include the screen name so intent is traceable.
5. Update [docs/OVERVIEW.md](../OVERVIEW.md) — v3 row count.
