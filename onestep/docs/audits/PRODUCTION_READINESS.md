# Production readiness assessment

**Assessment date:** 2026-09-23  
**Scope:** Checked-in Next.js source, package/configuration files, documentation, Playwright configuration/tests, and current working-tree implementation. Firebase Console settings, deployed Firestore rules/indexes, host configuration, production logs, provider dashboards, backups, and live browser testing are outside scope.

## Outcome

The repository is **not sufficient evidence to declare OneStep production-ready**. The core application is implemented, but authorization, deployment, operational, and test evidence needed for a production decision is absent or incomplete.

## Blocking findings

### 1. Firestore authorization is not reproducible

The browser directly accesses `users`, `tasks`, `moods`, and `focusSessions`. No Firestore rules, indexes, Firebase configuration, or emulator tests are tracked. The source cannot show whether a user can access only their own records, whether client-controlled ownership fields are protected, or whether required indexes exist.

**Required evidence:** version-controlled rules/indexes/deployment configuration and emulator tests for anonymous, own-user, and cross-user read/write attempts.

### 2. In-process rate limits do not cover distributed deployment

`rateLimit.ts` uses a module-level map and forwarding headers. Counters are process-local, disappear on cold start, and do not aggregate across instances.

**Required evidence:** a shared/platform control with deliberate proxy-header handling and tests/observability for the deployed topology.

### 3. Authenticated GET responses can enter the PWA cache

The service worker caches every successful same-origin `GET` response. That behavior does not exclude protected navigation or `GET /api/account/export`.

**Required evidence:** a reviewed cache policy that excludes sensitive responses, plus browser Cache Storage tests after authenticated navigation and export.

### 4. Critical controls lack automated tests

Only duplicate landing-page Playwright tests exist. No tests cover Firestore rules, API authentication, session revocation, OTP expiry/replay, export, deletion, or PWA caching.

**Required evidence:** focused emulator/API/browser tests for these paths, run in CI with safe test configuration.

## Material risks to address

- `OTP_SECRET` is optional in code and has predictable fallbacks; require a strong deployment secret.
- The deletion phrase is a browser-only guard; the endpoint verifies identity but not the phrase or recent re-authentication.
- Task and focus-session creation are separate writes, so partial failure can leave an orphan active task.
- Dashboard/history/export load all matching user records without pagination, bounds, or aggregate documents.
- No source-controlled monitoring, alerting, backup/recovery, deployment/rollback, or incident-response configuration exists.
- No CSP/HSTS is configured in source; hosting-layer controls are not available for review.

## Positive source observations

- Admin APIs derive identity from verified Firebase ID tokens.
- The proxy verifies a revoked Firebase Admin session cookie for protected pages.
- OTPs are hashed, expire, track attempts, and are transactionally checked.
- Server-sensitive modules use `server-only`; `.gitignore` excludes environment/credential filenames.
- Response headers include `nosniff`, referrer policy, frame denial, and limited permissions policy.

These controls do not offset the missing Firestore authorization evidence or establish production assurance.

## Validation record

On 2026-09-23, `npm run lint` passed. `npm run build` passed and emitted a non-blocking warning that an outer workspace `package-lock.json` was selected as the Turbopack root. `npx playwright test` ran 12 duplicate landing-page cases: 8 passed in Chromium/WebKit; the 4 Firefox cases failed while creating a browser page with `Cannot read properties of undefined (reading '_page')`, before an application assertion. The former audit also recorded a historical successful `npm audit --omit=dev`, which was not rerun for this documentation migration.

These results cannot validate external Firebase, Resend, Vercel, Firestore-rule, or browser-cache configuration.

## Exit criteria

Reassess only after the blocking evidence exists, the material risks have owners and tested mitigations, and a deployment-specific review validates provider configuration, headers, secrets, monitoring, recovery, and user-data flows.
