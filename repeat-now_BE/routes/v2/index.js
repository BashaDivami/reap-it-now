/**
 * v2 — Modified client APIs.
 *
 * Rules:
 *  - Only endpoints that differ from v1 belong here (30-40% tweak budget).
 *  - Endpoints removed from v1 are explicitly listed with a 410 Gone response.
 *  - Endpoints unchanged from v1 are NOT duplicated here.
 *  - Document every change in docs/v2/CHANGES.md.
 */
const router = require('express').Router();
const makeController = require('../../lib/makeController');

// ── Example: tweaked endpoint ─────────────────────────────────────────────
// const usersCtrl = makeController('v2', 'users');
// router.get('/users', usersCtrl.getAll);   // response shape changed
//
// ── Example: removed endpoint ────────────────────────────────────────────
// router.delete('/users/:id', (req, res) =>
//   res.status(410).json({ message: 'This endpoint was removed in v2' }));
// ─────────────────────────────────────────────────────────────────────────

module.exports = router;
