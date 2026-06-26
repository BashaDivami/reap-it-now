/**
 * v2 — Modified client APIs.
 *
 * Rules:
 *  - Only endpoints that differ from v1 belong here.
 *  - Endpoints unchanged from v1 are NOT duplicated here.
 *  - No endpoints are removed — v1 always remains intact.
 *  - Document every change in docs/v2/CHANGES.md.
 */
const router = require('express').Router();
const makeController = require('../../lib/makeController');

// ── Example: tweaked endpoint ─────────────────────────────────────────────
// const signalsCtrl = makeController('v2', 'signals');
// router.get('/orgs/:orgId/signals/incidents', signalsCtrl.getAll);
// ─────────────────────────────────────────────────────────────────────────

// ── auth ─────────────────────────────────────────────────────────────────
// v1 auth endpoints return wrong shapes. These v2 overrides return the
// correct contract shapes the frontend auth layer expects.

// POST /auth/password/verify → { loginTx }
router.post('/auth/password/verify', (req, res) => {
  res.json({ loginTx: `ltx-mock-${Date.now()}`, loginTxExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() });
});

// POST /auth/token → TokenResponse
router.post('/auth/token', (req, res) => {
  res.json({ accessToken: `mock-access-${Date.now()}`, refreshToken: `mock-refresh-${Date.now()}`, tokenType: 'Bearer', expiresIn: 3600 });
});

// GET /auth/me → Me (nested shape)
router.get('/auth/me', (req, res) => {
  res.json({
    user: { id: 'user-001', email: 'demo@reap.cloud', name: 'Demo User', status: 'active', emailVerified: true, mfaEnabled: false, authMethods: ['password'] },
    memberships: [{ id: 'mbr-001', orgId: 'org-demo', orgSlug: 'demo-org', orgName: 'Demo Org', status: 'active', rolesResolved: [{ slug: 'admin', name: 'Admin' }] }],
    activeOrg: { orgId: 'org-demo', orgSlug: 'demo-org', rolesResolved: [{ slug: 'admin', name: 'Admin' }] },
  });
});
// ─────────────────────────────────────────────────────────────────────────

// ── signals/incidents ────────────────────────────────────────────────────
// v1 requires scopeType + scopeId as mandatory query params.
// v2 makes them optional — Incidents screen fetches all org incidents without a scope filter.
// ─────────────────────────────────────────────────────────────────────────

module.exports = router;
