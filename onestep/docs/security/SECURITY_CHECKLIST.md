# Security verification checklist

This checklist separates code observations from unverified environment work. A checked item means only that it is visible in the current source, not that it has been independently tested in deployment.

## Source-visible

- [x] Firebase Admin routes verify bearer ID tokens for session creation, OTP verification, export, and deletion.
- [x] Protected page navigation verifies a 24-hour Firebase Admin session cookie with revocation checking.
- [x] OTP values are hashed, expire after 10 minutes, and have five recorded attempts.
- [x] Authentication and sensitive routes call the in-memory rate-limit helper.
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

- [ ] Use a shared or platform-backed rate limit for multi-instance deployments.
- [ ] Require a strong `OTP_SECRET`; do not rely on code fallbacks.
- [ ] Add a server-side confirmation/re-authentication control if the deletion phrase is meant as a security boundary.
- [ ] Add a CSP and evaluate HSTS at the deployment boundary.
- [ ] Prevent sensitive same-origin `GET` responses from entering the service-worker cache.
- [ ] Add emulator/API authorization tests and coverage for OTP, export, deletion, and session revocation.
- [ ] Define and implement OTP expiry cleanup or a Firestore TTL policy.

Use this list as implementation work tracking. It is not an attestation of POPIA, GDPR, OWASP, SOC 2, ISO 27001, or any other framework.
