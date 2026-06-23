# v1 — Client-Provided APIs (REAP API v1.3.0)

Mirrored exactly from `openapi/public/v1/openapi.yaml`.
Run `npm run generate:sdk` after any spec update (see [GUIDELINES §4](../../claude/rules/GUIDELINES.md)).

---

## Frontend Active Usage

Track which v1 endpoints the frontend is actually calling.
Update this table as screens are built. If an endpoint needs a change for the UI, move the tweak to v2 — do not patch v1.

| Method | Path | Screen / Feature | Notes |
|--------|------|-----------------|-------|
| — | — | — | _(add rows as frontend integration begins)_ |

---

## Summary

| Stat | Value |
|------|-------|
| Total paths | 162 |
| Total method+path pairs | 234 |
| Domains | 32 |
| Action endpoints (`:verb`) | 10 |
| Stream endpoints (`/stream`) | 2 |

## Domains

`api-keys` · `audit` · `auth` · `aws` · `chat` · `connector-clusters` · `connectors` · `credential-assignments` · `credential-stores` · `credentials` · `dashboards` · `delegations` · `devices` · `discovery` · `endpoints` · `files` · `grafana` · `idp` · `integrations` · `invitations` · `knowledge` · `memberships` · `metrics` · `msp` · `orgs` · `roles` · `runbooks` · `secrets` · `signals` · `sites` · `topology` · `visibility`

## Notes

- All data is seeded as empty `[]` in `data/v1/<domain>.json`. Add seed rows manually.
- If an endpoint breaks the UI, move the fix to **v2** — do not patch v1.
- Action endpoints (`:attach`, `:apply`, etc.) always return `{ success: true, action, params }`.
- Stream endpoints (`/stream`) return an SSE stub with a 5-second tick.

---

## All Endpoints

| Method  | Path | Description |
|---------|------|-------------|
| POST   | `/auth/discover/start` | Begin SSO discovery / HRD for an email |
| POST   | `/auth/discover/verify` | Complete discovery with a one-time code |
| POST   | `/auth/password/register` | Password registration — set password (email-verified) |
| POST   | `/auth/password/verify` | Password sign-in — verify |
| POST   | `/auth/password/reset` | Password reset — forgot flow (email-verified) |
| POST   | `/auth/password/change` | Password change — authenticated |
| POST   | `/auth/passkeys/attest` | Passkey registration — options |
| POST   | `/auth/passkeys/attest/verify` | Passkey registration — verify |
| POST   | `/auth/passkeys/assert` | Passkey sign-in — options |
| POST   | `/auth/passkeys/assert/verify` | Passkey sign-in — verify |
| POST   | `/auth/token` | Issue tokens |
| POST   | `/auth/logout` | Log out (revoke the current session) |
| GET    | `/auth/me` | Get current user and memberships |
| GET    | `/orgs/{orgId}/idp/connections` | List IdP connections |
| POST   | `/orgs/{orgId}/idp/connections` | Create an IdP connection (OIDC or SAML) |
| GET    | `/orgs/{orgId}/idp/connections/{connectionId}` | Get an IdP connection |
| PATCH  | `/orgs/{orgId}/idp/connections/{connectionId}` | Update an IdP connection (partial) |
| DELETE | `/orgs/{orgId}/idp/connections/{connectionId}` | Delete an IdP connection |
| GET    | `/orgs/{orgId}/idp/connections/{connectionId}/mappings` | List mapping rules |
| POST   | `/orgs/{orgId}/idp/connections/{connectionId}/mappings` | Create mapping rule |
| GET    | `/orgs/{orgId}/idp/connections/{connectionId}/mappings/{ruleId}` | Get mapping rule |
| PATCH  | `/orgs/{orgId}/idp/connections/{connectionId}/mappings/{ruleId}` | Update mapping rule (partial) |
| DELETE | `/orgs/{orgId}/idp/connections/{connectionId}/mappings/{ruleId}` | Delete mapping rule |
| GET    | `/orgs` | List organizations for current user |
| POST   | `/orgs` | Create organization |
| GET    | `/orgs/{orgId}` | Get organization |
| PATCH  | `/orgs/{orgId}` | Update organization |
| DELETE | `/orgs/{orgId}` | Delete organization |
| GET    | `/orgs/{orgId}/invitations` | List invitations |
| POST   | `/orgs/{orgId}/invitations` | Create an invitation |
| GET    | `/orgs/{orgId}/invitations/{invitationId}` | Get an invitation |
| DELETE | `/orgs/{orgId}/invitations/{invitationId}` | Revoke an invitation |
| POST   | `/orgs/{orgId}/invitations/{invitationId}/send` | Resend an invitation email |
| POST   | `/auth/invitations/accept` | Accept invitation and return emailTx with invited-org context |
| GET    | `/orgs/{orgId}/auth/policy` | Get org auth policy (singleton) |
| PUT    | `/orgs/{orgId}/auth/policy` | Update org auth policy (replace) |
| GET    | `/orgs/{orgId}/memberships` | List memberships |
| POST   | `/orgs/{orgId}/memberships` | Create membership (existing user) |
| GET    | `/orgs/{orgId}/memberships/{membershipId}` | Get a membership |
| PATCH  | `/orgs/{orgId}/memberships/{membershipId}` | Update a membership |
| DELETE | `/orgs/{orgId}/memberships/{membershipId}` | Remove membership |
| GET    | `/orgs/{orgId}/audit/events` | List audit events |
| GET    | `/orgs/{orgId}/audit/events/{eventId}` | Get a single audit event |
| GET    | `/orgs/{orgId}/roles` | List roles visible in the org |
| POST   | `/orgs/{orgId}/roles` | Create an org role |
| GET    | `/orgs/{orgId}/roles/{roleId}` | Get a role |
| PATCH  | `/orgs/{orgId}/roles/{roleId}` | Update a role |
| DELETE | `/orgs/{orgId}/roles/{roleId}` | Delete a role |
| GET    | `/orgs/{orgId}/sites` | List sites |
| POST   | `/orgs/{orgId}/sites` | Create site |
| GET    | `/orgs/{orgId}/sites/{siteId}` | Get site |
| PATCH  | `/orgs/{orgId}/sites/{siteId}` | Update site |
| DELETE | `/orgs/{orgId}/sites/{siteId}` | Delete site |
| GET    | `/orgs/{orgId}/integrations/aws/cloud-access` | List cloud access connections |
| POST   | `/orgs/{orgId}/integrations/aws/cloud-access/quick-create` | Create cloud access launch URL |
| GET    | `/orgs/{orgId}/connectors` | List connectors |
| POST   | `/orgs/{orgId}/connectors` | Create connector |
| GET    | `/orgs/{orgId}/connectors/{connectorId}` | Get connector |
| PATCH  | `/orgs/{orgId}/connectors/{connectorId}` | Update connector |
| DELETE | `/orgs/{orgId}/connectors/{connectorId}` | Delete connector |
| GET    | `/orgs/{orgId}/connectors/{connectorId}/userdata` | One-time connector bootstrap (cloud-init) |
| GET    | `/orgs/{orgId}/connector-clusters` | List connector clusters |
| POST   | `/orgs/{orgId}/connector-clusters` | Create connector cluster |
| GET    | `/orgs/{orgId}/connector-clusters/{clusterId}` | Get connector cluster |
| PATCH  | `/orgs/{orgId}/connector-clusters/{clusterId}` | Update connector cluster |
| DELETE | `/orgs/{orgId}/connector-clusters/{clusterId}` | Delete connector cluster |
| POST   | `/orgs/{orgId}/connector-clusters/{clusterId}/sites:attach` | Attach sites to a connector cluster |
| POST   | `/orgs/{orgId}/connector-clusters/{clusterId}/sites:detach` | Detach sites from a connector cluster |
| GET    | `/orgs/{orgId}/sites/{siteId}/connector-clusters` | List connector clusters attached to a site |
| GET    | `/orgs/{orgId}/secrets` | List secrets |
| POST   | `/orgs/{orgId}/secrets` | Create a secret |
| GET    | `/orgs/{orgId}/secrets/{secretId}` | Get a secret (metadata) |
| PATCH  | `/orgs/{orgId}/secrets/{secretId}` | Update secret metadata |
| DELETE | `/orgs/{orgId}/secrets/{secretId}` | Delete a secret |
| POST   | `/orgs/{orgId}/secrets/{secretId}/value` | Set/rotate secret value |
| GET    | `/orgs/{orgId}/credential-stores` | List credential stores |
| POST   | `/orgs/{orgId}/credential-stores` | Create credential store |
| GET    | `/orgs/{orgId}/credential-stores/{storeId}` | Get credential store |
| PATCH  | `/orgs/{orgId}/credential-stores/{storeId}` | Update credential store |
| DELETE | `/orgs/{orgId}/credential-stores/{storeId}` | Delete credential store |
| GET    | `/orgs/{orgId}/credentials` | List credentials |
| POST   | `/orgs/{orgId}/credentials` | Create credential |
| GET    | `/orgs/{orgId}/credentials/{credentialId}` | Get credential |
| PATCH  | `/orgs/{orgId}/credentials/{credentialId}` | Update credential |
| DELETE | `/orgs/{orgId}/credentials/{credentialId}` | Delete credential |
| GET    | `/orgs/{orgId}/credential-assignments` | List credential assignments |
| POST   | `/orgs/{orgId}/credential-assignments` | Create credential assignment |
| GET    | `/orgs/{orgId}/credential-assignments/{assignmentId}` | Get credential assignment |
| PATCH  | `/orgs/{orgId}/credential-assignments/{assignmentId}` | Update credential assignment |
| DELETE | `/orgs/{orgId}/credential-assignments/{assignmentId}` | Delete credential assignment |
| GET    | `/orgs/{orgId}/discovery/jobs` | List discovery jobs |
| POST   | `/orgs/{orgId}/discovery/jobs` | Create discovery job |
| GET    | `/orgs/{orgId}/discovery/jobs/{jobId}` | Get discovery job |
| PATCH  | `/orgs/{orgId}/discovery/jobs/{jobId}` | Update discovery job |
| DELETE | `/orgs/{orgId}/discovery/jobs/{jobId}` | Delete discovery job |
| GET    | `/orgs/{orgId}/discovery/jobs/{jobId}/runs` | List runs for a discovery job |
| POST   | `/orgs/{orgId}/discovery/jobs/{jobId}/runs` | Start a discovery run |
| GET    | `/orgs/{orgId}/discovery/jobs/{jobId}/runs/{runId}` | Get a discovery run |
| POST   | `/orgs/{orgId}/discovery/jobs/{jobId}/runs/{runId}` | Cancel a discovery run |
| GET    | `/orgs/{orgId}/discovery/jobs/{jobId}/runs/{runId}/events` | Stream discovery events (SSE) |
| GET    | `/orgs/{orgId}/discovery/sites/{siteId}/schedule-capabilities` | Get discovery schedule capabilities |
| GET    | `/orgs/{orgId}/devices` | List devices |
| POST   | `/orgs/{orgId}/devices` | Create device (testing/beta) |
| GET    | `/orgs/{orgId}/endpoints` | List endpoints |
| GET    | `/orgs/{orgId}/endpoints/{endpointId}` | Get endpoint |
| DELETE | `/orgs/{orgId}/endpoints/{endpointId}` | Delete endpoint |
| GET    | `/orgs/{orgId}/devices/{deviceId}` | Get device |
| PATCH  | `/orgs/{orgId}/devices/{deviceId}` | Update device (user fields / retire) |
| DELETE | `/orgs/{orgId}/devices/{deviceId}` | Delete device |
| GET    | `/orgs/{orgId}/devices/{deviceId}/running-config` | Get running config (latest) |
| GET    | `/orgs/{orgId}/devices/{deviceId}/running-config/versions` | List running config versions |
| GET    | `/orgs/{orgId}/devices/{deviceId}/running-config/diff` | Diff running config versions |
| GET    | `/orgs/{orgId}/devices/{deviceId}/running-config/startup-diff` | Diff running config against startup config |
| GET    | `/orgs/{orgId}/devices/merge` | Get merge candidates |
| POST   | `/orgs/{orgId}/devices/merge` | Merge devices |
| GET    | `/orgs/{orgId}/topology` | Organization topology (sites graph) |
| GET    | `/orgs/{orgId}/sites/{siteId}/topology` | Site topology (devices graph) |
| GET    | `/orgs/{orgId}/devices/{deviceId}/topology` | Device topology (components & interfaces) |
| GET    | `/orgs/{orgId}/topology/views` | List topology views (catalog) |
| POST   | `/orgs/{orgId}/topology/views` | Create a private custom topology view |
| GET    | `/orgs/{orgId}/topology/views/{viewId}` | Get a topology view catalog item |
| PATCH  | `/orgs/{orgId}/topology/views/{viewId}` | Update a saved custom topology view |
| DELETE | `/orgs/{orgId}/topology/views/{viewId}` | Delete a saved custom topology view |
| GET    | `/orgs/{orgId}/topology/views/{viewId}/params` | Get view parameter schema |
| GET    | `/orgs/{orgId}/topology/views/{viewId}/params/{paramName}/options` | Get parameter options (dynamic enums) |
| POST   | `/orgs/{orgId}/topology/views/{viewId}/resolve` | Resolve a topology view (primary UI entrypoint) |
| POST   | `/orgs/{orgId}/topology/semantic-context:resolve` | Resolve topology semantic context |
| POST   | `/orgs/{orgId}/topology/overlays:compile` | Compile a topology artifact overlay patch |
| GET    | `/orgs/{orgId}/topology/views/{viewId}/stream` | Stream resolved view updates (SSE) |
| GET    | `/orgs/{orgId}/topology/views/{viewId}/definition` | Get view definition (debug) |
| POST   | `/orgs/{orgId}/visibility/sessions` | Create or resume a topology workbench session |
| GET    | `/orgs/{orgId}/visibility/sessions/{sessionId}` | Get a topology workbench session |
| DELETE | `/orgs/{orgId}/visibility/sessions/{sessionId}` | Delete a topology workbench session |
| GET    | `/orgs/{orgId}/visibility/sessions/{sessionId}/stream` | Stream topology workbench session updates (SSE) |
| POST   | `/orgs/{orgId}/visibility/sessions/{sessionId}/proposals` | Create a topology workbench proposal |
| GET    | `/orgs/{orgId}/visibility/sessions/{sessionId}/proposals/{proposalId}` | Get a topology workbench proposal |
| POST   | `/orgs/{orgId}/visibility/sessions/{sessionId}/proposals/{proposalId}:preview` | Preview a topology workbench proposal |
| POST   | `/orgs/{orgId}/visibility/sessions/{sessionId}/proposals/{proposalId}:apply` | Apply a topology workbench proposal |
| POST   | `/orgs/{orgId}/visibility/sessions/{sessionId}/proposals/{proposalId}:reject` | Reject a topology workbench proposal |
| POST   | `/orgs/{orgId}/visibility/sessions/{sessionId}:undo` | Undo the most recent topology workbench change |
| GET    | `/orgs/{orgId}/api-keys` | List API keys |
| POST   | `/orgs/{orgId}/api-keys` | Create API key |
| GET    | `/orgs/{orgId}/api-keys/{apiKeyId}` | Get an API key |
| PATCH  | `/orgs/{orgId}/api-keys/{apiKeyId}` | Update API key (rename or extend expiry) |
| DELETE | `/orgs/{orgId}/api-keys/{apiKeyId}` | Revoke API key |
| GET    | `/orgs/{orgId}/integrations/aws/cloudtrail` | List AWS CloudTrail integrations |
| POST   | `/orgs/{orgId}/integrations/aws/cloudtrail` | Onboard AWS CloudTrail |
| GET    | `/orgs/{orgId}/integrations/aws/cloudtrail/{connectionId}` | Get AWS CloudTrail integration |
| DELETE | `/orgs/{orgId}/integrations/aws/cloudtrail/{connectionId}` | Delete AWS CloudTrail integration |
| POST   | `/orgs/{orgId}/integrations/aws/cloudtrail/{connectionId}/enable` | Enable AWS CloudTrail integration |
| POST   | `/orgs/{orgId}/integrations/aws/cloudtrail/{connectionId}/disable` | Disable AWS CloudTrail integration |
| POST   | `/orgs/{orgId}/aws/cloudtrail` | Ingest AWS CloudTrail event |
| GET    | `/orgs/{orgId}/integrations/aws/flowlogs` | List AWS Flow Logs integrations |
| POST   | `/orgs/{orgId}/integrations/aws/flowlogs` | Onboard AWS Flow Logs |
| GET    | `/orgs/{orgId}/integrations/aws/flowlogs/resources` | List AWS Flow Logs selectable resources |
| GET    | `/orgs/{orgId}/integrations/aws/flowlogs/{connectionId}` | Get AWS Flow Logs integration |
| DELETE | `/orgs/{orgId}/integrations/aws/flowlogs/{connectionId}` | Delete AWS Flow Logs integration |
| POST   | `/orgs/{orgId}/integrations/aws/flowlogs/{connectionId}/enable` | Enable AWS Flow Logs integration |
| POST   | `/orgs/{orgId}/integrations/aws/flowlogs/{connectionId}/disable` | Disable AWS Flow Logs integration |
| POST   | `/orgs/{orgId}/aws/flowlogs` | Receive AWS Flow Logs batch |
| GET    | `/orgs/{orgId}/integrations/aws/cloudwatch-logs` | List AWS CloudWatch Logs integrations |
| POST   | `/orgs/{orgId}/integrations/aws/cloudwatch-logs` | Onboard AWS CloudWatch Logs |
| GET    | `/orgs/{orgId}/integrations/aws/cloudwatch-logs/{connectionId}` | Get AWS CloudWatch Logs integration |
| DELETE | `/orgs/{orgId}/integrations/aws/cloudwatch-logs/{connectionId}` | Delete AWS CloudWatch Logs integration |
| POST   | `/orgs/{orgId}/integrations/aws/cloudwatch-logs/{connectionId}/enable` | Enable AWS CloudWatch Logs integration |
| POST   | `/orgs/{orgId}/integrations/aws/cloudwatch-logs/{connectionId}/disable` | Disable AWS CloudWatch Logs integration |
| POST   | `/orgs/{orgId}/aws/cloudwatch-logs` | Receive AWS CloudWatch Logs batch |
| GET    | `/orgs/{orgId}/delegations` | List delegations |
| GET    | `/orgs/{orgId}/delegations/{delegationId}` | Get a delegation |
| PATCH  | `/orgs/{orgId}/delegations/{delegationId}` | Update delegation status |
| GET    | `/orgs/{orgId}/delegations/invites` | List delegation invites |
| POST   | `/orgs/{orgId}/delegations/invites` | Create a delegation invite |
| POST   | `/orgs/{orgId}/delegations/invites/{inviteId}:resend` | Resend invite email (rotates token) |
| DELETE | `/orgs/{orgId}/delegations/invites/{inviteId}` | Revoke an invite |
| POST   | `/msp/delegations/accept` | Accept a customer delegation invite |
| GET    | `/msp/delegations` | List delegations (MSP view) |
| GET    | `/msp/delegations/{delegationId}` | Get a delegation (MSP view) |
| GET    | `/orgs/{orgId}/chat/threads` | List chat threads |
| POST   | `/orgs/{orgId}/chat/threads` | Create a thread |
| POST   | `/orgs/{orgId}/chat/threads/{threadId}/interact` | Post user message and start a run (atomic) |
| POST   | `/orgs/{orgId}/files` | Upload file |
| GET    | `/orgs/{orgId}/files/{fileId}` | Get file metadata |
| POST   | `/orgs/{orgId}/chat/rag-lookup` | Validate RAG lookup |
| GET    | `/orgs/{orgId}/chat/rag-collections/{collection}/documents` | List distinct RAG documents for a collection |
| GET    | `/orgs/{orgId}/chat/threads/{threadId}` | Get a thread |
| PATCH  | `/orgs/{orgId}/chat/threads/{threadId}` | Update a thread |
| DELETE | `/orgs/{orgId}/chat/threads/{threadId}` | Delete a thread |
| GET    | `/orgs/{orgId}/chat/threads/{threadId}/messages` | List messages in a thread |
| GET    | `/orgs/{orgId}/chat/messages/{messageId}` | Get a message |
| GET    | `/orgs/{orgId}/chat/runs` | List runs |
| GET    | `/orgs/{orgId}/chat/runs/{runId}` | Get a run |
| POST   | `/orgs/{orgId}/chat/runs/{runId}` | Cancel a run |
| GET    | `/orgs/{orgId}/chat/runs/{runId}/events` | Stream run events (SSE) |
| GET    | `/orgs/{orgId}/chat/runs/{runId}/artifacts` | List artifacts for a run |
| GET    | `/orgs/{orgId}/chat/runs/{runId}/artifacts/{artifactId}` | Get artifact document |
| GET    | `/orgs/{orgId}/chat/artifacts/{artifactId}` | Get artifact document by id |
| GET    | `/orgs/{orgId}/chat/artifacts/{artifactId}/stream` | Stream live artifact updates |
| POST   | `/orgs/{orgId}/chat/runs/{runId}/ratings` | Rate a run |
| POST   | `/orgs/{orgId}/chat/messages/{messageId}/reactions` | React to an assistant message |
| GET    | `/orgs/{orgId}/runbooks/templates` | List runbook templates |
| POST   | `/orgs/{orgId}/runbooks/templates/compile` | Start compiling and saving a runbook template draft |
| GET    | `/orgs/{orgId}/runbooks/templates/compilations/{compilationId}` | Get runbook template compilation status |
| GET    | `/orgs/{orgId}/runbooks/templates/compilations/{compilationId}/events` | Stream runbook template compilation events (SSE) |
| GET    | `/orgs/{orgId}/runbooks/templates/{runbookId}` | Get a runbook template |
| PATCH  | `/orgs/{orgId}/runbooks/templates/{runbookId}` | Update runbook template status |
| GET    | `/orgs/{orgId}/runbooks/templates/{runbookId}/versions` | List saved versions for a runbook template |
| GET    | `/orgs/{orgId}/runbooks/templates/versions/{runbookVersionId}` | Get a runbook template version |
| PATCH  | `/orgs/{orgId}/runbooks/templates/versions/{runbookVersionId}` | Update runbook template version status |
| GET    | `/orgs/{orgId}/runbooks/templates/versions/{runbookVersionId}/diagnostics` | List stored diagnostics for a runbook template version |
| POST   | `/orgs/{orgId}/runbooks/invocations/plan` | Plan a runbook invocation |
| GET    | `/orgs/{orgId}/knowledge/documents` | List knowledge documents |
| POST   | `/orgs/{orgId}/knowledge/documents` | Upload knowledge document |
| GET    | `/orgs/{orgId}/knowledge/document-types/weaviate-classes` | List Weaviate classes |
| GET    | `/orgs/{orgId}/knowledge/chunk-preview/jobs` | List chunk preview jobs |
| POST   | `/orgs/{orgId}/knowledge/chunk-preview/jobs` | Create chunk preview job |
| GET    | `/orgs/{orgId}/knowledge/chunk-preview/jobs/{jobId}` | Get chunk preview job |
| GET    | `/orgs/{orgId}/knowledge/chunk-preview/jobs/{jobId}/result` | Get chunk preview result |
| GET    | `/orgs/{orgId}/knowledge/chunk-preview/jobs/{jobId}/source` | Get chunk preview source PDF |
| POST   | `/orgs/{orgId}/knowledge/chunk-preview/jobs/{jobId}:cancel` | Cancel chunk preview job |
| GET    | `/orgs/{orgId}/dashboards/templates` | List dashboards templates metadata |
| GET    | `/orgs/{orgId}/dashboards/telemetry-targets` | List monitored telemetry targets for selector binding |
| GET    | `/orgs/{orgId}/dashboards/recommended` | Get contextual recommended widgets |
| GET    | `/orgs/{orgId}/dashboards/recommended-grafana` | Get recommended Grafana iframe URLs |
| GET    | `/orgs/{orgId}/signals/incidents` | List L3 incidents |
| GET    | `/orgs/{orgId}/signals/incidents/{incidentId}` | Get a single L3 incident |
| GET    | `/orgs/{orgId}/signals/incidents/{incidentId}/timeline` | Get incident timeline events |
| GET    | `/orgs/{orgId}/signals/incidents/{incidentId}/events` | Get incident event evidence |
| GET    | `/orgs/{orgId}/signals` | List L0 raw signal samples |
| GET    | `/orgs/{orgId}/signals/features` | List L1 feature values |
| GET    | `/orgs/{orgId}/signals/conditions` | List L2 condition states |
| GET    | `/orgs/{orgId}/signals/watchlist` | List watchlist items |
| POST   | `/orgs/{orgId}/metrics/query` | Metrics query (instant) |
| POST   | `/orgs/{orgId}/metrics/query_range` | Metrics query (range) |
| POST   | `/orgs/{orgId}/grafana/embed-session` | Bootstrap Grafana embed session (cookie) |
