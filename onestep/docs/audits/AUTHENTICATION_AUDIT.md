# Authentication and session audit

**Audit date:** 2026-11-08  
**Scope:** Authentication, email verification, OTP, password reset, session cookies, protected routes, Firebase initialization, rate limiting, service-worker caching, and related Playwright coverage in the checked-in source.

## 1. Executive summary

OneStep uses Firebase Authentication for identity, Firestore for profiles and OTP records, Firebase Admin for privileged API work and 24-hour session cookies, and Resend for transactional email. Server-side page protection is implemented in `src/proxy.ts`; client-readable cookies are only UI hints.

The source review found no confirmed authentication bypass in the inspected handlers. The earlier claim that client authentication headers were malformed was not substantiated: client and API code follow the Bearer-token pattern, and editor diagnostics found no syntax/type errors in the inspected auth files. A live Firebase request was not exercised.

The highest-priority verified weaknesses were a predictable OTP-secret fallback, process-local rate limiting, a non-atomic OTP resend cooldown, false verification failures when welcome-email delivery failed, silent logout-cookie cleanup failure, partial registration recovery, and service-worker caching of authenticated/API responses. Repairs were made for the approved findings. Deployment configuration and external provider behavior remain unverified.

## 2. Existing authentication architecture

- Email/password and Google popup authentication use the Firebase Web SDK in `src/lib/auth.ts`.
- Email/password registration creates a Firebase Auth user, updates its display name, writes `users/{uid}`, exchanges an ID token for a Firebase Admin session cookie, then requests email verification.
- Verification and reset codes are six digits, expire after 10 minutes, and are persisted as hashes in `emailOtps`. Verification attempts are counted transactionally.
- Authenticated API requests use Firebase ID tokens. Protected page navigation uses the HttpOnly `onestep-session` cookie, verified by Firebase Admin with revocation checking.
- The session cookie expires after 24 hours. Logout clears the cookie through `DELETE /api/auth/session`, signs out of Firebase in the browser, and clears UI-hint cookies.
- Password reset looks up the user by email, validates a reset OTP, and updates the password through Firebase Admin.
- The server uses Firebase Admin and Resend; browser code uses Firebase Web SDK and Firestore.

## 3. Verified defects and risk ratings

| Severity | Finding and root cause | Status |
|---|---|---|
| Medium | OTP hashes fell back to the Firebase private key, public project ID, or a literal when `OTP_SECRET` was missing. A leaked OTP record could permit offline guessing of the six-digit code. | Fixed: OTP processing now requires a dedicated secret of at least 32 characters. |
| Medium | API limits lived in a module-level map, trusted forwarded headers, and did not coordinate across deployed instances. | Fixed in source: rolling-window decisions are stored transactionally in Firestore and accept only a syntactically valid `x-real-ip`; missing/invalid values share an `unknown` bucket. |
| Medium | Resend cooldown used a read-then-write sequence. Concurrent sends could overwrite the only valid code; provider errors could leave an unusable code and cooldown. | Fixed: creation/cooldown check is transactional; provider-declared or thrown delivery failures remove the newly issued code if it is still current. |
| Medium | Verification committed Auth/profile changes and deleted the OTP before sending a welcome email, but welcome-email failure caused the endpoint to report verification failure. | Fixed: welcome email is best-effort; already-verified accounts are reconciled and can refresh their session through the resend path. |
| Medium | Logout swallowed server-cookie clearing errors and returned success-shaped behavior after local sign-out. | Fixed: local sign-out happens only after the server confirms cookie clearing; failures are visible and leave the user signed in so logout can be retried. |
| Medium | Registration/session creation failure could leave a Firebase account/profile while blocking the subsequent verification request. | Fixed: local auth state is cleared and the user is told the account exists and can be recovered by signing in. |
| Medium | The service worker cached arbitrary same-origin GET responses, including API/export responses, and could serve them offline. | Fixed: cache version incremented; only public static assets are cached, navigation is not stored, and export responses use `Cache-Control: no-store`. |
| Low | The browser logged complete Firebase error objects, which may contain provider metadata. | Fixed: the client no longer logs raw Firebase auth errors. |

No evidence was found that the client sends OTPs, passwords, or ID tokens to browser logs. The logging repair removes full Firebase auth error objects rather than relying on their current shape.

## 4. Security risks not verified from source

- **Firestore access control:** No Firestore rules, indexes, Firebase deployment configuration, or emulator setup are checked in. Cross-user read/write authorization depends on deployed rules and cannot be established from this repository.
- **Rate-limit deployment:** The limiter now depends on Firestore and a TTL policy for `apiRateLimits.expiresAt`. The hosting proxy must overwrite `x-real-ip`; that behavior is external.
- **Secrets:** `OTP_SECRET` must be set in each deployment. Source enforces presence and minimum length but cannot establish entropy or secret rotation. Locally present credential files were not opened, and their history/exposure was not determined.
- **Password-reset session revocation:** The reset handler updates the Firebase Auth password but does not explicitly revoke refresh tokens/session cookies. Provider behavior after Admin password updates was not integration-tested; do not assume immediate revocation.
- **External mail delivery:** Resend domain configuration and production provider outcomes are not available in the repository.
- **Authentication headers:** Server handlers require `Authorization: Bearer <Firebase ID token>`. Source follows this pattern; live expired-token and revoked-token behavior remains untested.

## 5. Root-cause analysis

The primary failures were lifecycle sequencing and assumptions that local state implied durable server state. OTP issuance checked cooldown separately from writing the replacement code; verification treated welcome-email delivery as part of the authentication commit; logout treated a failed cookie-clear request as success; and the signup UI did not distinguish an account-created/session-failed outcome. Security controls also used predictable fallback secret material and per-process throttling. Finally, the service worker used a broad same-origin cache strategy without an authenticated-response boundary.

## 6. Changes implemented

- Require `OTP_SECRET` to be configured and at least 32 characters; remove all weaker fallbacks.
- Move API rate-limit windows to Firestore transactions, validate `x-real-ip`, and add a pure policy helper for deterministic testing.
- Make OTP cooldown and issuance atomic; inspect Resend's returned error and remove an unsent OTP when delivery fails.
- Treat welcome-email delivery as best-effort after successful verification; reconcile the profile if Firebase already marks the email verified and refresh the browser/server session.
- Make logout clearing failures visible and keep the user signed in until server cookie clearing is confirmed; preserve cleanup behavior after account deletion.
- Make partial registration/session failure explicit and recoverable through a subsequent login.
- Remove raw Firebase auth-error logging.
- Bump the service-worker cache version, cache only public static assets, exclude navigations/API responses, and mark exports `no-store`.
- Repair incorrect auth-page Playwright expectations, remove implicit-auth assumptions from the focus test, and add OTP-secret/rate-limit policy tests.
- Update authentication, security, deployment, PWA, and testing documentation.

## 7. Tests performed and results

- Targeted VS Code Playwright run for `auth-policy.spec.ts`, `auth.spec.ts`, `focus.spec.ts`, and `protected-routes.spec.ts`: **16 passed, 0 failed**.
- Full VS Code Playwright rerun: **24 passed, 0 failed**. An earlier full run had one Chromium landing-navigation failure; the test passed in isolation and the subsequent full run passed.
- VS Code diagnostics on changed TypeScript source and test files: **no errors reported**. This is not a full `tsc` run.
- ESLint and production build were **not run**. The available terminal/PowerShell was unavailable, the configured npm task was not present, and task creation could not obtain a terminal.
- Firebase Emulator/API integration tests and production-mode service-worker tests were **not run**. No emulator configuration exists in the repository.

The successful Playwright run covers policy helpers, auth-page rendering/validation, and logged-out route redirects. It does not prove real Firebase/Google/Resend behavior or distributed Firestore transaction behavior.

## 8. Remaining limitations

- The requested full matrix—successful and duplicate registration, invalid credentials, Google popup success, OTP expiry/replay/resend, password-reset success and session invalidation, multi-tab/session-expiry behavior, and unauthenticated privileged API calls—still needs emulator-backed or appropriately mocked integration tests.
- Firestore TTL and trusted proxy header settings require deployment configuration.
- Firestore rules and required data indexes remain outside the checked-in source.
- Existing duplicate landing-page tests remain.
- Full lint/build results are unavailable for this change set.

## 9. Recommended next steps

1. Configure Firestore TTL on `apiRateLimits.expiresAt` and verify the host overwrites `x-real-ip`.
2. Add and test Firestore rules with Firebase Emulator Suite for anonymous, own-user, and cross-user operations.
3. Add non-production integration coverage for the complete auth/OTP/reset/session matrix, including provider errors and concurrent resend.
4. Verify Firebase Admin password-update revocation semantics and implement explicit refresh-token revocation if existing sessions are not invalidated.
5. Run `npm run lint`, `npm run build`, and the complete Playwright suite in an environment with a working terminal.
