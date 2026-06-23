# v2 — Modified Client APIs

Endpoints here **differ** from v1 in some way — response shape, field names, added fields, or status codes.
Unchanged v1 endpoints are not duplicated here; the frontend calls v1 for those.

See [GUIDELINES §2](../../claude/rules/GUIDELINES.md) for the 40% budget rule.

---

## Endpoints

| Method | Path | What changed from v1 | Reason |
|--------|------|----------------------|--------|
| — | — | — | _(no v2 tweaks yet)_ |

<!--
Change type examples:
  MODIFIED  — response shape, field names, added/removed fields, or status codes changed
-->

---

## How to add a v2 tweak

1. Add the route to `routes/v2/index.js`.
2. If the data shape changed, add `data/v2/<resource>.json` with the new shape.
3. Add a row to the table above with a clear reason for the change.
4. Update [docs/OVERVIEW.md](../OVERVIEW.md) — v2 row count.
