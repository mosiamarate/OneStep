# Monitoring

## Observable instrumentation

- The root layout renders the Vercel Analytics React component.
- Client and route-handler catch blocks commonly write errors to the browser/server console with `console.error` or `console.warn`.
- The update prompt polls `GET /api/app-version` every five minutes while mounted.
- GitHub Actions records Playwright test results and uploads the HTML report as an artifact when its workflow runs.

## Not configured in source

No application error-monitoring SDK, structured logging, log sink, trace system, uptime monitor, alert rule, dashboard, SLO/SLI, incident paging integration, audit log, or metrics-retention setting is checked in. Vercel Analytics presence does not establish alerting, error capture, user-level analytics, or deployed dashboard configuration.

## Minimum signals to verify externally

Before operating a deployment, identify where the following signals are captured and who can access them:

- hosting request/error logs and deployment events;
- Firebase Authentication sign-in, token, and user-management events;
- Firestore permission-denied and quota/billing indicators;
- Resend delivery, bounce, and sender-domain events;
- API route failures and rate-limit responses;
- service-worker update and cache-related browser failures.

Document retention, access control, redaction, alert thresholds, and escalation owners in the operating environment. The repository contains none of those decisions.
