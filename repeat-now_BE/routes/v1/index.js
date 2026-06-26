/**
 * v1 routes — strictly matches openapi/public/v1/openapi.yaml (REAP API v1.3.0)
 * 32 domains, 234 routes.
 */
const router = require('express').Router();

const apiKeysCtrl               = require('./controllers/api-keys.controller');
const auditCtrl                 = require('./controllers/audit.controller');
const authCtrl                  = require('./controllers/auth.controller');
const awsCtrl                   = require('./controllers/aws.controller');
const chatCtrl                  = require('./controllers/chat.controller');
const connectorClustersCtrl     = require('./controllers/connector-clusters.controller');
const connectorsCtrl            = require('./controllers/connectors.controller');
const credentialAssignmentsCtrl = require('./controllers/credential-assignments.controller');
const credentialStoresCtrl      = require('./controllers/credential-stores.controller');
const credentialsCtrl           = require('./controllers/credentials.controller');
const dashboardsCtrl            = require('./controllers/dashboards.controller');
const delegationsCtrl           = require('./controllers/delegations.controller');
const devicesCtrl               = require('./controllers/devices.controller');
const discoveryCtrl             = require('./controllers/discovery.controller');
const endpointsCtrl             = require('./controllers/endpoints.controller');
const filesCtrl                 = require('./controllers/files.controller');
const grafanaCtrl               = require('./controllers/grafana.controller');
const idpCtrl                   = require('./controllers/idp.controller');
const integrationsCtrl          = require('./controllers/integrations.controller');
const invitationsCtrl           = require('./controllers/invitations.controller');
const knowledgeCtrl             = require('./controllers/knowledge.controller');
const membershipsCtrl           = require('./controllers/memberships.controller');
const metricsCtrl               = require('./controllers/metrics.controller');
const mspCtrl                   = require('./controllers/msp.controller');
const orgsCtrl                  = require('./controllers/orgs.controller');
const rolesCtrl                 = require('./controllers/roles.controller');
const runbooksCtrl              = require('./controllers/runbooks.controller');
const secretsCtrl               = require('./controllers/secrets.controller');
const signalsCtrl               = require('./controllers/signals.controller');
const sitesCtrl                 = require('./controllers/sites.controller');
const topologyCtrl              = require('./controllers/topology.controller');
const visibilityCtrl            = require('./controllers/visibility.controller');

// Action endpoint handler (RPC-style :verb endpoints)
function actionHandler(label) {
  return (req, res) => res.json({ success: true, action: label, params: req.params });
}

// SSE stream stub
function streamHandler(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.write('data: {"status":"connected"}\n\n');
  const t = setInterval(() => res.write(`data: {"tick":${Date.now()}}\n\n`), 5000);
  req.on('close', () => clearInterval(t));
}

// ── api-keys ────────────────────────────────────────────────────
router.get('/orgs/:orgId/api-keys', apiKeysCtrl.getAll);
router.post('/orgs/:orgId/api-keys', apiKeysCtrl.create);
router.get('/orgs/:orgId/api-keys/:apiKeyId', apiKeysCtrl.getOne);
router.patch('/orgs/:orgId/api-keys/:apiKeyId', apiKeysCtrl.update);
router.delete('/orgs/:orgId/api-keys/:apiKeyId', apiKeysCtrl.remove);

// ── audit ───────────────────────────────────────────────────────
router.get('/orgs/:orgId/audit/events', auditCtrl.getAll);
router.get('/orgs/:orgId/audit/events/:eventId', auditCtrl.getOne);

// ── auth ────────────────────────────────────────────────────────
router.post('/auth/discover/start', authCtrl.discoverStart);
router.post('/auth/discover/verify', authCtrl.discoverVerify);
router.post('/auth/password/register', authCtrl.passwordRegister);
router.post('/auth/password/verify', authCtrl.passwordVerify);
router.post('/auth/password/reset', authCtrl.passwordReset);
router.post('/auth/password/change', authCtrl.passwordChange);
router.post('/auth/passkeys/attest', authCtrl.passkeyAttest);
router.post('/auth/passkeys/attest/verify', authCtrl.passkeyAttestVerify);
router.post('/auth/passkeys/assert', authCtrl.passkeyAssert);
router.post('/auth/passkeys/assert/verify', authCtrl.passkeyAssertVerify);
router.post('/auth/token', authCtrl.token);
router.post('/auth/logout', authCtrl.logout);
router.get('/auth/me', authCtrl.me);
router.post('/auth/invitations/accept', authCtrl.invitationAccept);
router.get('/orgs/:orgId/auth/policy', authCtrl.getPolicy);
router.put('/orgs/:orgId/auth/policy', authCtrl.updatePolicy);

// ── aws ─────────────────────────────────────────────────────────
router.post('/orgs/:orgId/aws/cloudtrail', awsCtrl.create);
router.post('/orgs/:orgId/aws/flowlogs', awsCtrl.create);
router.post('/orgs/:orgId/aws/cloudwatch-logs', awsCtrl.create);

// ── chat ────────────────────────────────────────────────────────
router.get('/orgs/:orgId/chat/threads', chatCtrl.getAll);
router.post('/orgs/:orgId/chat/threads', chatCtrl.create);
router.get('/orgs/:orgId/chat/threads/:threadId', chatCtrl.getOne);
router.patch('/orgs/:orgId/chat/threads/:threadId', chatCtrl.update);
router.delete('/orgs/:orgId/chat/threads/:threadId', chatCtrl.remove);
router.post('/orgs/:orgId/chat/threads/:threadId/interact', chatCtrl.create);
router.get('/orgs/:orgId/chat/threads/:threadId/messages', chatCtrl.getOne);
router.post('/orgs/:orgId/chat/rag-lookup', chatCtrl.create);
router.get('/orgs/:orgId/chat/rag-collections/:collection/documents', chatCtrl.getOne);
router.get('/orgs/:orgId/chat/messages/:messageId', chatCtrl.getOne);
router.post('/orgs/:orgId/chat/messages/:messageId/reactions', chatCtrl.create);
router.get('/orgs/:orgId/chat/runs', chatCtrl.getAll);
router.get('/orgs/:orgId/chat/runs/:runId', chatCtrl.getOne);
router.post('/orgs/:orgId/chat/runs/:runId', chatCtrl.create);
router.get('/orgs/:orgId/chat/runs/:runId/events', chatCtrl.getOne);
router.get('/orgs/:orgId/chat/runs/:runId/artifacts', chatCtrl.getOne);
router.get('/orgs/:orgId/chat/runs/:runId/artifacts/:artifactId', chatCtrl.getOne);
router.post('/orgs/:orgId/chat/runs/:runId/ratings', chatCtrl.create);
router.get('/orgs/:orgId/chat/artifacts/:artifactId', chatCtrl.getOne);
router.get('/orgs/:orgId/chat/artifacts/:artifactId/stream', streamHandler);

// ── connector-clusters ──────────────────────────────────────────
router.get('/orgs/:orgId/connector-clusters', connectorClustersCtrl.getAll);
router.post('/orgs/:orgId/connector-clusters', connectorClustersCtrl.create);
router.get('/orgs/:orgId/connector-clusters/:clusterId', connectorClustersCtrl.getOne);
router.patch('/orgs/:orgId/connector-clusters/:clusterId', connectorClustersCtrl.update);
router.delete('/orgs/:orgId/connector-clusters/:clusterId', connectorClustersCtrl.remove);
router.post('/orgs/:orgId/connector-clusters/:clusterId/sites:attach', actionHandler('attach'));
router.post('/orgs/:orgId/connector-clusters/:clusterId/sites:detach', actionHandler('detach'));

// ── connectors ──────────────────────────────────────────────────
router.get('/orgs/:orgId/connectors', connectorsCtrl.getAll);
router.post('/orgs/:orgId/connectors', connectorsCtrl.create);
router.get('/orgs/:orgId/connectors/:connectorId', connectorsCtrl.getOne);
router.patch('/orgs/:orgId/connectors/:connectorId', connectorsCtrl.update);
router.delete('/orgs/:orgId/connectors/:connectorId', connectorsCtrl.remove);
router.get('/orgs/:orgId/connectors/:connectorId/userdata', connectorsCtrl.getOne);

// ── credential-assignments ──────────────────────────────────────
router.get('/orgs/:orgId/credential-assignments', credentialAssignmentsCtrl.getAll);
router.post('/orgs/:orgId/credential-assignments', credentialAssignmentsCtrl.create);
router.get('/orgs/:orgId/credential-assignments/:assignmentId', credentialAssignmentsCtrl.getOne);
router.patch('/orgs/:orgId/credential-assignments/:assignmentId', credentialAssignmentsCtrl.update);
router.delete('/orgs/:orgId/credential-assignments/:assignmentId', credentialAssignmentsCtrl.remove);

// ── credential-stores ───────────────────────────────────────────
router.get('/orgs/:orgId/credential-stores', credentialStoresCtrl.getAll);
router.post('/orgs/:orgId/credential-stores', credentialStoresCtrl.create);
router.get('/orgs/:orgId/credential-stores/:storeId', credentialStoresCtrl.getOne);
router.patch('/orgs/:orgId/credential-stores/:storeId', credentialStoresCtrl.update);
router.delete('/orgs/:orgId/credential-stores/:storeId', credentialStoresCtrl.remove);

// ── credentials ─────────────────────────────────────────────────
router.get('/orgs/:orgId/credentials', credentialsCtrl.getAll);
router.post('/orgs/:orgId/credentials', credentialsCtrl.create);
router.get('/orgs/:orgId/credentials/:credentialId', credentialsCtrl.getOne);
router.patch('/orgs/:orgId/credentials/:credentialId', credentialsCtrl.update);
router.delete('/orgs/:orgId/credentials/:credentialId', credentialsCtrl.remove);

// ── dashboards ──────────────────────────────────────────────────
router.get('/orgs/:orgId/dashboards/recommended', dashboardsCtrl.getOne);
router.get('/orgs/:orgId/dashboards/recommended-grafana', dashboardsCtrl.getOne);
router.get('/orgs/:orgId/dashboards/telemetry-targets', dashboardsCtrl.getOne);
router.get('/orgs/:orgId/dashboards/templates', dashboardsCtrl.getAll);

// ── delegations ─────────────────────────────────────────────────
router.get('/orgs/:orgId/delegations', delegationsCtrl.getAll);
router.get('/orgs/:orgId/delegations/invites', delegationsCtrl.getAll);
router.post('/orgs/:orgId/delegations/invites', delegationsCtrl.create);
router.post('/orgs/:orgId/delegations/invites/:inviteId:resend', actionHandler('resend'));
router.delete('/orgs/:orgId/delegations/invites/:inviteId', delegationsCtrl.remove);
router.get('/orgs/:orgId/delegations/:delegationId', delegationsCtrl.getOne);
router.patch('/orgs/:orgId/delegations/:delegationId', delegationsCtrl.update);

// ── devices ─────────────────────────────────────────────────────
router.get('/orgs/:orgId/devices', devicesCtrl.getAll);
router.post('/orgs/:orgId/devices', devicesCtrl.create);
router.get('/orgs/:orgId/devices/merge', devicesCtrl.getAll);
router.post('/orgs/:orgId/devices/merge', devicesCtrl.create);
router.get('/orgs/:orgId/devices/:deviceId', devicesCtrl.getOne);
router.patch('/orgs/:orgId/devices/:deviceId', devicesCtrl.update);
router.delete('/orgs/:orgId/devices/:deviceId', devicesCtrl.remove);
router.get('/orgs/:orgId/devices/:deviceId/running-config', devicesCtrl.getOne);
router.get('/orgs/:orgId/devices/:deviceId/running-config/versions', devicesCtrl.getOne);
router.get('/orgs/:orgId/devices/:deviceId/running-config/diff', devicesCtrl.getOne);
router.get('/orgs/:orgId/devices/:deviceId/running-config/startup-diff', devicesCtrl.getOne);
router.get('/orgs/:orgId/devices/:deviceId/topology', devicesCtrl.getOne);

// ── discovery ───────────────────────────────────────────────────
router.get('/orgs/:orgId/discovery/jobs', discoveryCtrl.getAll);
router.post('/orgs/:orgId/discovery/jobs', discoveryCtrl.create);
router.get('/orgs/:orgId/discovery/jobs/:jobId', discoveryCtrl.getOne);
router.patch('/orgs/:orgId/discovery/jobs/:jobId', discoveryCtrl.update);
router.delete('/orgs/:orgId/discovery/jobs/:jobId', discoveryCtrl.remove);
router.get('/orgs/:orgId/discovery/jobs/:jobId/runs', discoveryCtrl.getOne);
router.post('/orgs/:orgId/discovery/jobs/:jobId/runs', discoveryCtrl.create);
router.get('/orgs/:orgId/discovery/jobs/:jobId/runs/:runId', discoveryCtrl.getOne);
router.post('/orgs/:orgId/discovery/jobs/:jobId/runs/:runId', discoveryCtrl.create);
router.get('/orgs/:orgId/discovery/jobs/:jobId/runs/:runId/events', discoveryCtrl.getOne);
router.get('/orgs/:orgId/discovery/sites/:siteId/schedule-capabilities', discoveryCtrl.getOne);

// ── endpoints ───────────────────────────────────────────────────
router.get('/orgs/:orgId/endpoints', endpointsCtrl.getAll);
router.get('/orgs/:orgId/endpoints/:endpointId', endpointsCtrl.getOne);
router.delete('/orgs/:orgId/endpoints/:endpointId', endpointsCtrl.remove);

// ── files ───────────────────────────────────────────────────────
router.post('/orgs/:orgId/files', filesCtrl.create);
router.get('/orgs/:orgId/files/:fileId', filesCtrl.getOne);

// ── grafana ─────────────────────────────────────────────────────
router.post('/orgs/:orgId/grafana/embed-session', grafanaCtrl.create);

// ── idp ─────────────────────────────────────────────────────────
router.get('/orgs/:orgId/idp/connections', idpCtrl.getAll);
router.post('/orgs/:orgId/idp/connections', idpCtrl.create);
router.get('/orgs/:orgId/idp/connections/:connectionId', idpCtrl.getOne);
router.patch('/orgs/:orgId/idp/connections/:connectionId', idpCtrl.update);
router.delete('/orgs/:orgId/idp/connections/:connectionId', idpCtrl.remove);
router.get('/orgs/:orgId/idp/connections/:connectionId/mappings', idpCtrl.getOne);
router.post('/orgs/:orgId/idp/connections/:connectionId/mappings', idpCtrl.create);
router.get('/orgs/:orgId/idp/connections/:connectionId/mappings/:ruleId', idpCtrl.getOne);
router.patch('/orgs/:orgId/idp/connections/:connectionId/mappings/:ruleId', idpCtrl.update);
router.delete('/orgs/:orgId/idp/connections/:connectionId/mappings/:ruleId', idpCtrl.remove);

// ── integrations ────────────────────────────────────────────────
router.get('/orgs/:orgId/integrations/aws/cloud-access', integrationsCtrl.getOne);
router.post('/orgs/:orgId/integrations/aws/cloud-access/quick-create', integrationsCtrl.create);
router.get('/orgs/:orgId/integrations/aws/cloudtrail', integrationsCtrl.getAll);
router.post('/orgs/:orgId/integrations/aws/cloudtrail', integrationsCtrl.create);
router.get('/orgs/:orgId/integrations/aws/cloudtrail/:connectionId', integrationsCtrl.getOne);
router.delete('/orgs/:orgId/integrations/aws/cloudtrail/:connectionId', integrationsCtrl.remove);
router.post('/orgs/:orgId/integrations/aws/cloudtrail/:connectionId/enable', integrationsCtrl.create);
router.post('/orgs/:orgId/integrations/aws/cloudtrail/:connectionId/disable', integrationsCtrl.create);
router.get('/orgs/:orgId/integrations/aws/flowlogs', integrationsCtrl.getAll);
router.post('/orgs/:orgId/integrations/aws/flowlogs', integrationsCtrl.create);
router.get('/orgs/:orgId/integrations/aws/flowlogs/resources', integrationsCtrl.getAll);
router.get('/orgs/:orgId/integrations/aws/flowlogs/:connectionId', integrationsCtrl.getOne);
router.delete('/orgs/:orgId/integrations/aws/flowlogs/:connectionId', integrationsCtrl.remove);
router.post('/orgs/:orgId/integrations/aws/flowlogs/:connectionId/enable', integrationsCtrl.create);
router.post('/orgs/:orgId/integrations/aws/flowlogs/:connectionId/disable', integrationsCtrl.create);
router.get('/orgs/:orgId/integrations/aws/cloudwatch-logs', integrationsCtrl.getAll);
router.post('/orgs/:orgId/integrations/aws/cloudwatch-logs', integrationsCtrl.create);
router.get('/orgs/:orgId/integrations/aws/cloudwatch-logs/:connectionId', integrationsCtrl.getOne);
router.delete('/orgs/:orgId/integrations/aws/cloudwatch-logs/:connectionId', integrationsCtrl.remove);
router.post('/orgs/:orgId/integrations/aws/cloudwatch-logs/:connectionId/enable', integrationsCtrl.create);
router.post('/orgs/:orgId/integrations/aws/cloudwatch-logs/:connectionId/disable', integrationsCtrl.create);

// ── invitations ─────────────────────────────────────────────────
router.get('/orgs/:orgId/invitations', invitationsCtrl.getAll);
router.post('/orgs/:orgId/invitations', invitationsCtrl.create);
router.get('/orgs/:orgId/invitations/:invitationId', invitationsCtrl.getOne);
router.delete('/orgs/:orgId/invitations/:invitationId', invitationsCtrl.remove);
router.post('/orgs/:orgId/invitations/:invitationId/send', invitationsCtrl.create);

// ── knowledge ───────────────────────────────────────────────────
router.get('/orgs/:orgId/knowledge/documents', knowledgeCtrl.getAll);
router.post('/orgs/:orgId/knowledge/documents', knowledgeCtrl.create);
router.get('/orgs/:orgId/knowledge/document-types/weaviate-classes', knowledgeCtrl.getOne);
router.get('/orgs/:orgId/knowledge/chunk-preview/jobs', knowledgeCtrl.getAll);
router.post('/orgs/:orgId/knowledge/chunk-preview/jobs', knowledgeCtrl.create);
router.get('/orgs/:orgId/knowledge/chunk-preview/jobs/:jobId', knowledgeCtrl.getOne);
router.post('/orgs/:orgId/knowledge/chunk-preview/jobs/:jobId:cancel', actionHandler('cancel'));
router.get('/orgs/:orgId/knowledge/chunk-preview/jobs/:jobId/result', knowledgeCtrl.getOne);
router.get('/orgs/:orgId/knowledge/chunk-preview/jobs/:jobId/source', knowledgeCtrl.getOne);

// ── memberships ─────────────────────────────────────────────────
router.get('/orgs/:orgId/memberships', membershipsCtrl.getAll);
router.post('/orgs/:orgId/memberships', membershipsCtrl.create);
router.get('/orgs/:orgId/memberships/:membershipId', membershipsCtrl.getOne);
router.patch('/orgs/:orgId/memberships/:membershipId', membershipsCtrl.update);
router.delete('/orgs/:orgId/memberships/:membershipId', membershipsCtrl.remove);

// ── metrics ─────────────────────────────────────────────────────
router.post('/orgs/:orgId/metrics/query', metricsCtrl.create);
router.post('/orgs/:orgId/metrics/query_range', metricsCtrl.create);

// ── msp ─────────────────────────────────────────────────────────
router.get('/msp/delegations', mspCtrl.getAll);
router.get('/msp/delegations/:delegationId', mspCtrl.getOne);
router.post('/msp/delegations/accept', mspCtrl.create);

// ── orgs ────────────────────────────────────────────────────────
router.get('/orgs', orgsCtrl.getAll);
router.post('/orgs', orgsCtrl.create);
router.get('/orgs/:orgId', orgsCtrl.getOne);
router.patch('/orgs/:orgId', orgsCtrl.update);
router.delete('/orgs/:orgId', orgsCtrl.remove);

// ── roles ───────────────────────────────────────────────────────
router.get('/orgs/:orgId/roles', rolesCtrl.getAll);
router.post('/orgs/:orgId/roles', rolesCtrl.create);
router.get('/orgs/:orgId/roles/:roleId', rolesCtrl.getOne);
router.patch('/orgs/:orgId/roles/:roleId', rolesCtrl.update);
router.delete('/orgs/:orgId/roles/:roleId', rolesCtrl.remove);

// ── runbooks ────────────────────────────────────────────────────
router.get('/orgs/:orgId/runbooks/templates', runbooksCtrl.getAll);
router.post('/orgs/:orgId/runbooks/templates/compile', runbooksCtrl.create);
router.get('/orgs/:orgId/runbooks/templates/compilations/:compilationId', runbooksCtrl.getOne);
router.get('/orgs/:orgId/runbooks/templates/compilations/:compilationId/events', runbooksCtrl.getOne);
router.get('/orgs/:orgId/runbooks/templates/versions/:runbookVersionId', runbooksCtrl.getOne);
router.patch('/orgs/:orgId/runbooks/templates/versions/:runbookVersionId', runbooksCtrl.update);
router.get('/orgs/:orgId/runbooks/templates/versions/:runbookVersionId/diagnostics', runbooksCtrl.getOne);
router.get('/orgs/:orgId/runbooks/templates/:runbookId', runbooksCtrl.getOne);
router.patch('/orgs/:orgId/runbooks/templates/:runbookId', runbooksCtrl.update);
router.get('/orgs/:orgId/runbooks/templates/:runbookId/versions', runbooksCtrl.getOne);
router.post('/orgs/:orgId/runbooks/invocations/plan', runbooksCtrl.create);

// ── secrets ─────────────────────────────────────────────────────
router.get('/orgs/:orgId/secrets', secretsCtrl.getAll);
router.post('/orgs/:orgId/secrets', secretsCtrl.create);
router.get('/orgs/:orgId/secrets/:secretId', secretsCtrl.getOne);
router.patch('/orgs/:orgId/secrets/:secretId', secretsCtrl.update);
router.delete('/orgs/:orgId/secrets/:secretId', secretsCtrl.remove);
router.post('/orgs/:orgId/secrets/:secretId/value', secretsCtrl.create);

// ── signals ─────────────────────────────────────────────────────
router.get('/orgs/:orgId/signals', signalsCtrl.getAll);
router.get('/orgs/:orgId/signals/conditions', signalsCtrl.getOne);
router.get('/orgs/:orgId/signals/features', signalsCtrl.getOne);
router.get('/orgs/:orgId/signals/watchlist', signalsCtrl.getOne);
router.get('/orgs/:orgId/signals/incidents', signalsCtrl.getAll);
router.get('/orgs/:orgId/signals/incidents/:incidentId', signalsCtrl.getOne);
router.get('/orgs/:orgId/signals/incidents/:incidentId/events', signalsCtrl.getOne);
router.get('/orgs/:orgId/signals/incidents/:incidentId/timeline', signalsCtrl.getOne);

// ── sites ───────────────────────────────────────────────────────
router.get('/orgs/:orgId/sites', sitesCtrl.getAll);
router.post('/orgs/:orgId/sites', sitesCtrl.create);
router.get('/orgs/:orgId/sites/:siteId', sitesCtrl.getOne);
router.patch('/orgs/:orgId/sites/:siteId', sitesCtrl.update);
router.delete('/orgs/:orgId/sites/:siteId', sitesCtrl.remove);
router.get('/orgs/:orgId/sites/:siteId/connector-clusters', sitesCtrl.getOne);
router.get('/orgs/:orgId/sites/:siteId/topology', sitesCtrl.getOne);

// ── topology ────────────────────────────────────────────────────
router.get('/orgs/:orgId/topology', topologyCtrl.getAll);
router.get('/orgs/:orgId/topology/views', topologyCtrl.getAll);
router.post('/orgs/:orgId/topology/views', topologyCtrl.create);
router.get('/orgs/:orgId/topology/views/:viewId', topologyCtrl.getOne);
router.patch('/orgs/:orgId/topology/views/:viewId', topologyCtrl.update);
router.delete('/orgs/:orgId/topology/views/:viewId', topologyCtrl.remove);
router.get('/orgs/:orgId/topology/views/:viewId/params', topologyCtrl.getOne);
router.get('/orgs/:orgId/topology/views/:viewId/params/:paramName/options', topologyCtrl.getOne);
router.post('/orgs/:orgId/topology/views/:viewId/resolve', topologyCtrl.create);
router.get('/orgs/:orgId/topology/views/:viewId/stream', streamHandler);
router.get('/orgs/:orgId/topology/views/:viewId/definition', topologyCtrl.getOne);
router.post('/orgs/:orgId/topology/semantic-context:resolve', actionHandler('resolve'));
router.post('/orgs/:orgId/topology/overlays:compile', actionHandler('compile'));

// ── visibility ──────────────────────────────────────────────────
router.post('/orgs/:orgId/visibility/sessions', visibilityCtrl.create);
router.get('/orgs/:orgId/visibility/sessions/:sessionId', visibilityCtrl.getOne);
router.delete('/orgs/:orgId/visibility/sessions/:sessionId', visibilityCtrl.remove);
router.get('/orgs/:orgId/visibility/sessions/:sessionId/stream', streamHandler);
router.post('/orgs/:orgId/visibility/sessions/:sessionId/proposals', visibilityCtrl.create);
router.get('/orgs/:orgId/visibility/sessions/:sessionId/proposals/:proposalId', visibilityCtrl.getOne);
router.post('/orgs/:orgId/visibility/sessions/:sessionId/proposals/:proposalId:preview', actionHandler('preview'));
router.post('/orgs/:orgId/visibility/sessions/:sessionId/proposals/:proposalId:apply', actionHandler('apply'));
router.post('/orgs/:orgId/visibility/sessions/:sessionId/proposals/:proposalId:reject', actionHandler('reject'));
router.post('/orgs/:orgId/visibility/sessions/:sessionId:undo', actionHandler('undo'));

module.exports = router;
