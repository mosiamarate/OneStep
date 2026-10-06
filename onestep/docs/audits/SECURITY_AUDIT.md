# Security assessment

**Type:** source-level review  
**Date:** 2026-09-23  
**Not an independent audit:** No penetration test, production configuration review, Firebase rule review, or external certification is evidenced in the repository.

## Review result

The application contains meaningful server-side identity verification, session-cookie handling, OTP hashing, and route-level checks. Its most important data-authorization layer—Firestore rules—is absent from source control, so the review cannot assess effective client data isolation.

## Findings

| Priority | Finding | Evidence and impact |
| --- | --- | --- |
| High | Firestore rules/indexes are missing | Browser uses direct Firestore access. Cross-user/unauthenticated access and schema constraints cannot be verified. |
| High | Service worker caches all same-origin GETs | Protected page/API content, including export response, may persist in Cache Storage. |
| Medium | Rate limiter is process-local | Limits can be bypassed across instances/cold starts and trust forwarded headers. |
| Medium | OTP secret has fallback values | A missing `OTP_SECRET` falls back to values not designed as a dedicated secret. |
| Medium | Account deletion confirmation is UI-only | The endpoint checks bearer identity but no phrase/re-authentication. |
| Medium | No automated authorization or API tests | Control behavior is untested by the current suite. |
| Medium | No automatic expired-OTP cleanup | Expired unused OTP documents can remain until a flow deletes or overwrites them. |
| Low | CSP/HSTS are not configured in source | Current headers are narrower than a full browser-hardening policy. |

## Controls observed

- Firebase Admin verifies ID tokens before sensitive route operations.
- Protected page navigation validates Firebase session cookies with revocation checking.
- OTP values are hashed and checked in Firestore transactions with expiry and attempt limits.
- Forgot-password response does not explicitly reveal whether an account lookup/email send succeeded.
- Admin/Resend modules are designated server-only, and ignored secret-file patterns are present.

## Assessment limits

This review does not establish confidentiality, integrity, availability, legal compliance, POPIA/GDPR status, OWASP conformance, accessibility, data residency, vendor security, or absence of vulnerabilities. See [SECURITY.md](../security/SECURITY.md) and [THREAT_MODEL.md](../security/THREAT_MODEL.md) for concrete remediation work.
