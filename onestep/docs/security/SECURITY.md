# Security implementation

This document describes controls observable in the checked-in source. It is not an independent security assessment and does not establish compliance with a security standard.

## Implemented controls

| Area | Observable implementation |
| --- | --- |
| Page access | `src/proxy.ts` verifies the Firebase Admin `onestep-session` cookie with revocation checking for protected page routes. The session lifetime is 24 hours. |
| Privileged APIs | Session creation, email verification, export, and deletion derive `uid` from `adminAuth.verifyIdToken` rather than accepting a user ID parameter. |
| Admin code | Firebase Admin and Resend modules are server-only imports. API routes using Admin export `runtime = "nodejs"`. |
| OTP storage | Verification and reset codes are six digits, expire after 10 minutes, permit five recorded attempts, and are stored as SHA-256 hashes rather than raw codes. Hashing requires a dedicated `OTP_SECRET` of at least 32 characters. |
| OTP replay | Verification occurs in a Firestore transaction; valid codes are marked used and then deleted. |
| Request throttling | API routes apply Firestore-transaction-backed per-scope rolling limits: authentication actions use 10 requests/minute and strict actions use 5 requests/10 minutes. Configure TTL on `apiRateLimits.expiresAt`. |
| Account operations | Export and deletion require a bearer Firebase ID token. Deletion batches application documents by verified `uid` before deleting the Firebase Auth user. |
| Browser headers | Next.js config sends `nosniff`, `strict-origin-when-cross-origin`, `DENY` framing, and a restrictive camera/microphone/geolocation permissions policy. |

## Limits and open risks

### Firestore authorization is not reviewable

The browser directly reads and writes user profile, task, mood, and focus-session data. No `firestore.rules`, indexes, Firebase configuration, emulator setup, or deployment configuration exists in the tracked repository. The deployed Firestore rules are therefore the decisive authorization boundary and cannot be verified here. Do not claim user-data isolation from this source tree alone.

### Rate limits are local to a process

`src/lib/rateLimit.ts` uses Firestore transactions, so counters coordinate across server instances. It accepts a syntactically valid `x-real-ip` value; configure the hosting proxy to overwrite this header. Missing/invalid values share an `unknown` bucket. Firestore availability and the configured TTL policy are operational dependencies.

### OTP secret fallback is weak

OTP generation and verification fail closed unless `OTP_SECRET` is configured with at least 32 characters. Use a unique, high-entropy server-only value.

### Client cookies are not an authorization boundary

`onestep-authenticated` and `onestep-email-verified` are JavaScript-readable, seven-day UI-hint cookies. The client guard reads the verification hint. They are not `HttpOnly` or `Secure` in the setter; the Admin session cookie is the server-side route-protection mechanism. API routes that access sensitive data verify an ID token independently.

### Account-deletion confirmation is UI-only

The settings page requires `DELETE MY ACCOUNT` before it sends its request, but `/api/account/delete` does not receive or verify that phrase. Any client that possesses a valid ID token can call the endpoint. The endpoint's identity check remains present, but the phrase is not a server-side safeguard.

### Remaining observable gaps

- No Content Security Policy or HSTS is configured in `next.config.ts`.
- No Firestore authorization tests, API authorization tests, dependency scan workflow, or security monitoring/alerting integration is tracked.
- No automatic deletion of expired OTP documents is configured.
- The service worker caches only public static assets; dynamic navigation and API responses are excluded, and the data-export endpoint sends `Cache-Control: no-store`. See [PWA.md](../deployment/PWA.md).
- No independent penetration test, source-code audit, or compliance certification is evidenced.

## Security-relevant source locations

- Authentication flow: [AUTHENTICATION.md](AUTHENTICATION.md)
- Threats and residual risks: [THREAT_MODEL.md](THREAT_MODEL.md)
- Verification work: [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)
- Data shape and deletion boundaries: [DATA_MODEL.md](../architecture/DATA_MODEL.md)
