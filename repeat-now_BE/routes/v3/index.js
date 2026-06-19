/**
 * v3 — New APIs for screens not covered by the client spec.
 *
 * Rules:
 *  - Only net-new endpoints live here — nothing from v1 or v2.
 *  - Each endpoint must be documented in docs/v3/CHANGES.md with the screen
 *    it was added for and what data it serves.
 */
const router = require('express').Router();
const makeController = require('../../lib/makeController');

// ── Add new-screen endpoints below ────────────────────────────────────────
// const dashboardCtrl = makeController('v3', 'dashboard');
// router.get('/dashboard/summary', dashboardCtrl.getAll);
// ─────────────────────────────────────────────────────────────────────────

module.exports = router;
