# Threat model

## Scope and assumptions

This is a source-level threat model for the browser application, Next.js route handlers, Firebase Authentication/Firestore, Resend, and the service worker. It does not model Firebase Console configuration, deployed network controls, provider operations, or user devices beyond the code paths visible here.

## Assets and boundaries

| Asset | Boundary that should protect it |
| --- | --- |
| Firebase account and password | Firebase Authentication and the OTP reset flow |
| Session cookie | HttpOnly Firebase Admin cookie verified by `proxy.ts` |
| Profile, task, mood, and focus data | Deployed Firestore rules; browser-side query and write code |
| OTP records and Resend key | Server-side Firebase Admin/Resend route handlers and environment configuration |
| Exported JSON | Bearer-ID-token check, browser download, and browser cache behavior |
| Service-worker cache | Browser origin and `public/sw.js` caching logic |

## Threats, current treatment, and residual risk

| Threat | Current treatment | Residual risk |
| --- | --- | --- |
| A user reads or writes another user's Firestore data | Client code scopes normal queries by `userId`; no rules are tracked | High: query filtering is not authorization, and deployed rules are unknown |
| Stolen or invalid bearer token calls privileged API | Handlers verify Firebase ID token and derive UID; proxy verifies session cookies with revocation checking | Token theft, Firebase configuration, and endpoint tests are outside the repository |
| OTP guessing or replay | Six digits, hashes, expiry, attempts, transaction, and deletion after use | Per-process route limits; secret fallback; no independent verification |
| Password-reset account enumeration | Forgot-password route returns success after valid input whether lookup/delivery succeeds or fails | Timing and provider-response side channels are not tested |
| High-volume auth or deletion requests | In-memory, IP-header-based route limits | Limits do not span serverless instances or cold starts |
| Accidental account deletion | UI requires a typed phrase | Endpoint does not validate phrase or require recent re-authentication |
| Persisting sensitive responses in browser cache | Network-first worker falls back to cache | Same-origin `GET` responses, including protected navigations and export, may be cached |
| Secret disclosure | `.gitignore` excludes environment and common Admin-key files; admin modules are server-only | Git history, CI artifacts, host secrets, and the local ignored credential file are not audited here |
| Malicious script or browser hardening bypass | Several response headers are configured | No CSP or HSTS is configured in source |
| Undetected incident | Console errors and provider/platform tooling may exist externally | No application monitoring, alerting, or incident process is tracked |

## Priority remediation evidence needed

1. Check in reviewed Firestore rules, indexes, and Firebase deployment configuration; test them with the emulator for anonymous, own-user, and cross-user access.
2. Replace or augment the in-memory limiter with a shared platform/service control and test its behavior across instances.
3. Require `OTP_SECRET` at deployment and remove predictable fallback sources.
4. Exclude authenticated and API responses from the service-worker cache, then test Cache Storage after export and authenticated navigation.
5. Add authorization, OTP, deletion, and account-export tests before relying on control descriptions as assurance.
