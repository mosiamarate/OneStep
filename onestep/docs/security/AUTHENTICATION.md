# Authentication and account security

Firebase Authentication is the identity provider. Firebase Web SDK code performs email/password and Google popup sign-in; Firebase Admin code issues and verifies the server session cookie and performs privileged account mutations.

## Email/password signup and verification

1. The client calls Firebase `createUserWithEmailAndPassword` and sets the Firebase Auth display name.
2. It creates `users/{uid}` with `emailOtpVerified: false` through the Firestore Web SDK.
3. It exchanges the Firebase ID token at `POST /api/auth/session` for the 24-hour `onestep-session` cookie and sends UI-hint cookies.
4. It calls `POST /api/auth/send-verification` with its bearer ID token.
5. The handler verifies the token, creates/replaces `emailOtps/EMAIL_VERIFICATION_{uid}`, and sends a Resend email.
6. `POST /api/auth/verify-email` transactionally validates the code, calls Firebase Admin `updateUser(..., { emailVerified: true })`, updates the profile flags, deletes the OTP document, and attempts to send a welcome email.
7. The client refreshes its Firebase ID token and creates a new server session so the `email_verified` claim is available to the proxy.

The resend and send/verify-OTP paths are aliases of the verification handlers. Only the two purposes described below are used by the UI.

## Google sign-in

`signInWithPopup` with `GoogleAuthProvider` is used for both login and signup. The client merges a profile document with `provider: "google"` and `emailOtpVerified: true`, then creates the server session. Google-provider configuration and authorized domains are Firebase Console settings and are not tracked.

## Password reset

1. `POST /api/auth/forgot-password` accepts an email and always returns `{ ok: true }` after valid input, even if lookup or email delivery fails.
2. When the Firebase Auth account exists, it creates/replaces `emailOtps/PASSWORD_RESET_{uid}` and sends a Resend reset email.
3. `POST /api/auth/reset-password` validates email, a six-digit code, and a six-character minimum password, then transactionally validates the OTP and calls Firebase Admin `updateUser(..., { password })`.

This is a custom OTP reset flow. The app does not invoke Firebase's browser password-reset email action.

## OTP behavior

| Property | Code behavior |
| --- | --- |
| Format | Six numeric digits generated with Node `crypto.randomInt` |
| Storage | SHA-256 hash of `uid`, purpose, OTP, and the configured fallback secret; no raw OTP field |
| Validity | 10 minutes |
| Attempts | Five recorded failed attempts; a later request returns `429` and requires a new code |
| Resend cooldown | 60 seconds, based on the prior OTP document's `createdAt` |
| Scope | One document per `purpose` and user; a new send overwrites the prior document after cooldown |

The `OTP_PURPOSES` type also contains `LOGIN_VERIFICATION` and `CHANGE_EMAIL`, but no current UI or route uses them.

## Sessions and route checks

- `POST /api/auth/session` verifies an ID token and creates the `onestep-session` Firebase session cookie. It is `HttpOnly`, `SameSite=Lax`, path `/`, `Secure` only when `NODE_ENV === "production"`, and has a 24-hour maximum age.
- `DELETE /api/auth/session` clears that server cookie. Client logout also calls Firebase `signOut` and clears the UI-hint cookies.
- `src/proxy.ts` protects dashboard, focus, history, mood, task, and settings pages. It verifies the session cookie with `checkRevoked: true`, redirects unauthenticated requests to login, and redirects a session without `email_verified` to verification.
- `ProtectedRoute` performs a second client-side Firebase auth check and relies on the client-readable verification hint. Treat it as UI behavior, not server authorization.

## Account export and deletion

Both endpoints require a bearer ID token and derive the target UID from it. Export returns a JSON attachment containing profile, task, mood, and focus-session records queried by `userId`. Deletion removes the `users/{uid}` document and matching `tasks`, `moods`, `focusSessions`, and `emailOtps` documents, then deletes the Firebase Auth user. See [DATA_RETENTION.md](../privacy/DATA_RETENTION.md) for boundaries the handler cannot verify.

The confirmation phrase in the settings UI is not validated by the endpoint. It reduces accidental clicks in that UI but is not a server-side re-authentication control.
