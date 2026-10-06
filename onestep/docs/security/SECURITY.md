# Security implementation

This document describes controls observable in the checked-in source. It is not an independent security assessment and does not establish compliance with a security standard.

## Implemented controls

| Area | Observable implementation |
| --- | --- |
| Page access | `src/proxy.ts` verifies the Firebase Admin `onestep-session` cookie with revocation checking for protected page routes. The session lifetime is 24 hours. |
| Privileged APIs | Session creation, email verification, export, and deletion derive `uid` from `adminAuth.verifyIdToken` rather than accepting a user ID parameter. |
| Admin code | Firebase Admin and Resend modules are server-only imports. API routes using Admin export `runtime = "nodejs"`. |
| OTP storage | Verification and reset codes are six digits, expire after 10 minutes, permit five recorded attempts, and are stored as SHA-256 hashes rather than raw codes. |
| OTP replay | Verification occurs in a Firestore transaction; valid codes are marked used and then deleted. |
| Request throttling | API routes apply in-memory per-scope limits: authentication actions use 10 requests/minute and strict actions use 5 requests/10 minutes. |
| Account operations | Export and deletion require a bearer Firebase ID token. Deletion batches application documents by verified `uid` before deleting the Firebase Auth user. |
| Browser headers | Next.js config sends `nosniff`, `strict-origin-when-cross-origin`, `DENY` framing, and a restrictive camera/microphone/geolocation permissions policy. |

## Limits and open risks

### Firestore authorization is not reviewable

The browser directly reads and writes user profile, task, mood, and focus-session data. No `firestore.rules`, indexes, Firebase configuration, emulator setup, or deployment configuration exists in the tracked repository. The deployed Firestore rules are therefore the decisive authorization boundary and cannot be verified here. Do not claim user-data isolation from this source tree alone.

### Rate limits are local to a process

`src/lib/rateLimit.ts` stores timestamps in a module-level `Map` and uses `x-real-ip` or the first `x-forwarded-for` value. Limits reset on cold start and do not coordinate across instances. They are useful route-level checks, not a distributed production-rate-limit guarantee.

### OTP secret fallback is weak

`OTP_SECRET` is preferred, but `src/lib/otp.ts` falls back to `FIREBASE_PRIVATE_KEY`, then a public Firebase project ID, then the literal `"onestep"`. A unique, high-entropy `OTP_SECRET` is required for a defensible deployment; source does not require it at startup.

### Client cookies are not an authorization boundary

`onestep-authenticated` and `onestep-email-verified` are JavaScript-readable, seven-day UI-hint cookies. The client guard reads the verification hint. They are not `HttpOnly` or `Secure` in the setter; the Admin session cookie is the server-side route-protection mechanism. API routes that access sensitive data verify an ID token independently.

### Account-deletion confirmation is UI-only

The settings page requires `DELETE MY ACCOUNT` before it sends its request, but `/api/account/delete` does not receive or verify that phrase. Any client that possesses a valid ID token can call the endpoint. The endpoint's identity check remains present, but the phrase is not a server-side safeguard.

### Remaining observable gaps

- No Content Security Policy or HSTS is configured in `next.config.ts`.
- No Firestore authorization tests, API authorization tests, dependency scan workflow, or security monitoring/alerting integration is tracked.
- No automatic deletion of expired OTP documents is configured.
- The service worker caches same-origin `GET` responses; see [PWA.md](../deployment/PWA.md) for the privacy and cache implications.
- No independent penetration test, source-code audit, or compliance certification is evidenced.

## Security-relevant source locations

- Authentication flow: [AUTHENTICATION.md](AUTHENTICATION.md)
- Threats and residual risks: [THREAT_MODEL.md](THREAT_MODEL.md)
- Verification work: [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)
- Data shape and deletion boundaries: [DATA_MODEL.md](../architecture/DATA_MODEL.md)
