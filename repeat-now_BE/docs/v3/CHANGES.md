# v3 — New Screen APIs

Endpoints in this version did **not exist** in the client spec.
They were added because a screen in the frontend needed data not served by v1 or v2.

## Endpoints

| Method | Path | Screen | Description |
|--------|------|--------|-------------|
| —      | —    | —      | No new endpoints yet |

## How to add a v3 endpoint

1. Add the route to `routes/v3/index.js` using `makeController('v3', '<resource>')`.
2. Create `data/v3/<resource>.json` with seed data.
3. Add a row to the table above (include the screen name so intent is traceable).
