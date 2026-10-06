# Incident response

## Current status

The repository does not contain an incident-response policy, on-call roster, security reporting channel, ticket workflow, incident template, notification process, or log-retention configuration. This runbook is a proposed response sequence grounded in the application's implementation; it does not claim an operational response capability exists.

## Triage boundaries

| Incident type | Initial evidence to collect | Code/configuration boundary |
| --- | --- | --- |
| Suspected account/session compromise | UID, timestamps, relevant Firebase Auth events, session behavior | Firebase Auth, session-cookie route, and proxy; console settings are external |
| Cross-user Firestore access | Request/UID, affected collection/document, deployed rules, emulator reproduction | Firestore rules are absent from source control |
| OTP abuse or email failure | Endpoint, response status, rate-limit scope, Resend event data | In-memory limiter and Resend configuration |
| Accidental deletion/export exposure | UID, request time, route response, browser/cache state | Admin deletion/export handlers and browser service worker |
| Stale/offline PWA behavior | Browser/version, worker/cache name, cached URL | `public/sw.js` and version endpoint |

## Immediate containment guidance

1. Preserve evidence without copying credentials, OTPs, full bearer tokens, exports, or free-text mood/reflection content into tickets or public channels.
2. For suspected credential exposure, rotate the affected provider credential through Firebase, Resend, or the host and review deployment environment access. No rotation automation is tracked.
3. For suspected Firestore authorization failure, restrict affected rules through the Firebase deployment process, capture the deployed rules, and reproduce with the emulator before reopening access.
4. For compromised user sessions, use Firebase administrative controls to disable/revoke as appropriate and verify the proxy's revoked-session behavior after the change.
5. For a harmful PWA cache release, publish a reviewed worker/cache fix and give users clear browser-cache remediation instructions after validating the result.

## Follow-up work

Record scope, affected data categories, timeline, containment, recovery, and corrective changes in an approved private system. Add tests and source-controlled configuration for each discovered gap. Do not claim breach notification, regulator notification, forensic preservation, recovery times, or external communications are already defined; they are not present in the repository.
