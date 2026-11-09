# Security verification checklist

This checklist separates code observations from unverified environment work. A checked item means only that it is visible in the current source, not that it has been independently tested in deployment.

## Source-visible

- [x] Firebase Admin routes verify bearer ID tokens for session creation, OTP verification, export, and deletion.
- [x] Protected page navigation verifies a 24-hour Firebase Admin session cookie with revocation checking.
- [x] OTP values are hashed, expire after 10 minutes, and have five recorded attempts.
- [x] Authentication and sensitive routes use Firestore-transaction-backed rolling rate limits.
- [x] OTP processing requires a dedicated `OTP_SECRET` with at least 32 characters.
- [x] Service worker caches only public static assets; account exports use `Cache-Control: no-store`.
- [x] The delete endpoint derives the account from the verified token.
- [x] Basic `nosniff`, referrer, frame, and permissions headers are configured.
- [x] `.gitignore` excludes `.env*` and common Firebase Admin credential file names.

## Not verified from this repository

- [ ] Reviewed Firestore security rules are version-controlled and deployed.
- [ ] Firestore indexes and deployment configuration are version-controlled.
- [ ] Firebase authorized domains, provider configuration, and token settings are reviewed.
- [ ] Resend sender/domain configuration is verified.
- [ ] Hosting TLS, HSTS, edge controls, and production headers are verified.
- [ ] Secrets were never committed, copied to CI artifacts, or exposed in deployment logs.
- [ ] Provider backups, data location, and retention are understood.
- [ ] An incident response owner, reporting channel, monitoring, and alerting path are configured.

## Known remediation work

- [ ] Add a server-side confirmation/re-authentication control if the deletion phrase is meant as a security boundary.
- [ ] Add a CSP and evaluate HSTS at the deployment boundary.
- [ ] Add emulator/API authorization tests and coverage for OTP, export, deletion, and session revocation.
- [ ] Configure Firestore TTL for `apiRateLimits.expiresAt`.
- [ ] Confirm the hosting proxy overwrites `x-real-ip`.

Use this list as implementation work tracking. It is not an attestation of POPIA, GDPR, OWASP, SOC 2, ISO 27001, or any other framework.
