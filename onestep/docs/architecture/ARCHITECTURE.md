# Architecture

## Runtime shape

```text
Browser (Next.js client components)
  |-- Firebase Web SDK: Authentication and direct Firestore reads/writes
  |-- Next.js route handlers: session cookie, OTP email, export, deletion, version
  |-- Production only: service-worker registration and Vercel Analytics component

Next.js server / route handlers
  |-- Firebase Admin SDK: ID-token and session-cookie verification, Auth mutations,
  |   Firestore admin reads/writes
  `-- Resend: verification, reset, and welcome email delivery

Firebase Authentication and Firestore
```

The application uses the Next.js App Router. Pages and client components live in `src/app` and `src/components`; browser data access is concentrated in `src/lib/firebase.ts` and service modules under `src/services`.

## Trust boundaries

- Browser authentication uses the Firebase Web SDK. It also writes `users`, `moods`, `tasks`, and `focusSessions` directly to Firestore.
- API handlers derive identity from a verified Firebase ID token, not from a client-supplied user ID, for session creation, OTP verification, data export, and account deletion.
- Firebase Admin and Resend code is marked `server-only` where imported through server modules. Admin credentials and the Resend key must remain server-side.
- `src/proxy.ts` verifies the `onestep-session` Firebase Admin session cookie before protected page navigation. Client-readable cookies are UI hints used by the client guard.

## Routes

Public routes include `/`, `/privacy`, `/terms`, and the authentication pages. `src/proxy.ts` protects `/dashboard`, `/focus`, `/history`, `/mood`, `/task`, and `/settings/*`; authenticated users whose session token lacks `email_verified` are redirected to `/auth/verify-email`.

Route handlers are:

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/auth/session` | `POST`, `DELETE` | Create or clear the server session cookie |
| `/api/auth/send-verification` and aliases | `POST` | Send an email-verification OTP |
| `/api/auth/verify-email` and alias | `POST` | Validate an OTP and mark an account verified |
| `/api/auth/forgot-password` | `POST` | Request a password-reset OTP without exposing account existence |
| `/api/auth/reset-password` | `POST` | Validate an OTP and set a Firebase Auth password |
| `/api/account/export` | `GET` | Return the authenticated user's JSON export |
| `/api/account/delete` | `POST` | Delete the authenticated user's application records and Firebase Auth user |
| `/api/app-version` | `GET` | Return `APP_VERSION` without caching |

`/api/auth/resend-verification`, `/api/auth/send-otp`, and `/api/auth/verify-otp` re-export the verification handlers; they are not separate flows.

## Important implementation constraints

- No Firestore rules, indexes, `firebase.json`, or Firebase emulator configuration is checked in. Direct browser data access therefore cannot be authorized or reproduced from source alone.
- Task creation writes a task and then creates its focus session in separate client operations; a failure can leave an active task without a session.
- Dashboard and history query entire matching user collections in the browser, then filter and sort in memory.
- There are no server actions, background jobs, cron jobs, webhooks, or custom backend service in this repository.

See [DATA_MODEL.md](DATA_MODEL.md) and [SECURITY.md](../security/SECURITY.md) for concrete fields and security implications.
