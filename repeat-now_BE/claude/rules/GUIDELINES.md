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

### v1 — Client spec (do not modify)
- Endpoints in v1 mirror `openapi.yml` exactly.
- Generate with `npm run generate:v1`. Do not hand-edit the output.
- If an endpoint breaks the UI, fix it in **v2**, never in v1.

### v2 — Tweaks to client spec (≤ 40% of v1 surface)
- Only endpoints that **differ** from v1 belong here.
- Unchanged endpoints are not duplicated — frontend calls v1 for those.
- Removed endpoints return `410 Gone` with a descriptive message.
- Budget: at most 40% of v1 endpoints may appear in v2.

### v3 — Net-new endpoints
- Only endpoints that do **not exist** in v1 or v2 belong here.
- Every endpoint must be tied to a specific screen (document in `docs/v3/CHANGES.md`).

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

All endpoints must return one of:

```json
{ "data": [ ... ], "total": N }      // collection
{ "data": { ... } }                   // single item
{ "message": "..." }                  // error or confirmation
```

Do not return raw arrays or bare objects at the top level.

---

## 6. Adding a new resource

1. Choose the correct version (v1/v2/v3) per the rules above.
2. Create `data/<version>/<resource>.json` with `[]` or seed data.
3. Add routes using `makeController('<version>', '<resource>')` in the version's `index.js`.
4. Update the corresponding `docs/<version>/CHANGES.md`.

---

## 7. Removing or deprecating an endpoint (v2 only)

```js
router.delete('/resource/:id', (req, res) =>
  res.status(410).json({ message: 'Removed in v2: <reason>' }));
```

Never hard-delete a v1 route — express it as 410 in v2.

---

## Summary decision tree

```
Is the endpoint in openapi.yml?
  YES → Does it work as-is for the UI?
          YES → use v1 (no change needed)
          NO  → tweak it in v2 (within 40% budget)
  NO  → Is it for a new screen?
          YES → add to v3
          NO  → do not add it yet; confirm with team
```
