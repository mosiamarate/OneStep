# User flows

## Email/password onboarding

```text
Sign up
  -> Firebase Auth account + Firestore user profile
  -> server session cookie
  -> verification code request
  -> /auth/verify-email
  -> code validation and refreshed session
  -> /dashboard
```

If the verification email cannot be sent after account creation, the user has an unverified account and must use the verification route/resend control. The server proxy redirects a session without the Firebase `email_verified` claim away from protected page routes.

## Google onboarding/login

```text
Google popup
  -> Firebase Auth result
  -> Firestore profile merge with emailOtpVerified true
  -> server session cookie
  -> requested page or dashboard
```

Google-provider enablement and authorized-domain configuration are external Firebase settings.

## Focus flow

```text
Dashboard
  -> optional mood check-in (or skip)
  -> one task + duration (1 minute to 24 hours)
  -> active task write
  -> active focus-session write
  -> /focus?sessionId=...
  -> pause/resume/checkpoints, hour-aware countdown, or end decision
  -> after 90 minutes, optional 5/10/15-minute break prompt
  -> completed, cancelled, or interrupted session
  -> optional break before the next session and after-session reflection
  -> dashboard, next mood check-in, or history
```

The dashboard can route directly to a pending task or unfinished session. A direct focus URL without a session ID can run a client timer but the normal persistence path is created by the task page.

## Focus recovery

```text
Open dashboard or focus session
  -> query most recent active/paused/interrupted record
  -> active record with stale lastActiveAt may become interrupted
  -> user resumes or cancels
```

This behavior is browser/client initiated; no server job advances or resolves timers while the app is closed.

## Data export and deletion

```text
Settings > Data & Privacy
  -> Firebase ID token
  -> GET /api/account/export
  -> browser JSON download

Settings > Account Security
  -> UI phrase confirmation
  -> Firebase ID token
  -> POST /api/account/delete
  -> delete Firestore queries + Firebase Auth account
  -> client logout and login redirect
```

The server validates the ID token but not the confirmation phrase. Export/deletion scope and non-recoverable boundaries are documented in [DATA_RETENTION.md](../privacy/DATA_RETENTION.md).
