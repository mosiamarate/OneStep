# Environment variables

This table reflects direct reads from the checked-in code. `.env.example` currently lists only the public Firebase variables, so it is incomplete for server-side auth, account APIs, and email.

## Public browser configuration

| Variable | Used by | Required in source |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web SDK | Yes for configured Firebase client |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Web SDK | Yes for configured Firebase client |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Web SDK; Admin project-ID fallback | Yes for configured Firebase client |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Web SDK configuration | Yes for configured Firebase client |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Web SDK configuration | Yes for configured Firebase client |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Web SDK configuration | Yes for configured Firebase client |
| `NEXT_PUBLIC_APP_URL` | Welcome-email link | Optional; defaults to `https://onestepapp.co.za` |

These values are intentionally exposed to the browser by their prefix. They are configuration values, not locations for Admin credentials or API secrets.

## Server-only Firebase Admin configuration

The code supports one of these credential forms:

| Variable | Behavior |
| --- | --- |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Preferred: JSON string parsed and passed to Firebase Admin `cert()` |
| `FIREBASE_PROJECT_ID` | Used with split credentials; otherwise public project ID can be used as fallback |
| `FIREBASE_CLIENT_EMAIL` | Split service-account credential |
| `FIREBASE_PRIVATE_KEY` | Split service-account credential; escaped newlines are replaced |

If neither credential form is present, `firebaseAdmin.ts` initializes Firebase Admin with only a project ID. Whether that works depends on the runtime's credentials; source does not validate or guarantee it.

## Server-only email and OTP configuration

| Variable | Behavior |
| --- | --- |
| `RESEND_API_KEY` | Required when sending OTP or welcome email; missing value raises a handler error |
| `EMAIL_FROM` | Optional sender; defaults to `OneStep <noreply@onestepapp.co.za>` |
| `SUPPORT_EMAIL` | Optional email-template contact; defaults to `support@onestepapp.co.za` |
| `OTP_SECRET` | Required server-only OTP hash secret. Must contain at least 32 characters and should be generated uniquely with high entropy. |

OTP operations fail closed when `OTP_SECRET` is missing or shorter than 32 characters. There is no fallback to Firebase credentials, public project configuration, or a literal.

## Distributed rate limiting

The API rate limiter stores rolling-window timestamps in the Admin-only `apiRateLimits` collection. Set a Firestore TTL policy on its `expiresAt` field so expired rate-limit documents are removed. The limiter uses a valid `x-real-ip` address supplied by the hosting proxy; if absent or invalid, requests share the conservative `unknown` bucket. Configure the proxy to overwrite this header rather than forwarding a client-provided value.

## Environment validation caveat

`src/lib/env.ts` contains an illustrative Zod schema, but no application code imports it. `zod` is also not a direct package dependency. It does not currently enforce deployment-time validation. Update or remove that module deliberately before claiming environment validation exists.

## Handling rules

- Keep service-account JSON, private keys, Resend key, and OTP secret out of Git, browser code, logs, and documentation examples.
- `.gitignore` excludes `.env*` and common Firebase Admin filenames, including the locally present ignored credential filename.
- Rotate credentials through the relevant provider if exposure is suspected; no rotation automation is tracked.
