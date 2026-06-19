# v2 — Modified Client APIs

This version contains only the endpoints that **differ** from v1.
Unchanged v1 endpoints are not duplicated here — the frontend should call v1 for those.

## Budget rule

At most **40%** of v1 endpoints may be modified or removed in v2.
If more changes are needed, revisit the client spec first.

## Endpoints

| Method | Path | Change type | Reason |
|--------|------|-------------|--------|
| —      | —    | —           | No changes yet |

<!--
Change types:
  MODIFIED  — response shape, field names, or status codes changed
  REMOVED   — endpoint returns 410 Gone; frontend must not call it
-->

## How to add a v2 change

1. Add the route to `routes/v2/index.js`.
2. If the data shape changed, add `data/v2/<resource>.json` with the new shape.
3. Add a row to the table above.
