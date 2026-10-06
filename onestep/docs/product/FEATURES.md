# Features

## Authentication and account

- Create an email/password account with a full name, email, and password of at least six characters.
- Sign in or sign up using a Google popup provider.
- Verify email/password accounts with a six-digit code sent through Resend.
- Request a password-reset code and set a new six-character-minimum password.
- View/update display name in Firebase Auth and Firestore.
- Download an on-demand JSON export of profile, tasks, moods, and focus sessions.
- Delete the Firebase Auth account and queried application data from the account settings UI.

The deletion confirmation phrase is enforced in the browser UI, not by the API. The source does not include email-address changes, multi-factor authentication, account recovery beyond password reset, user roles, or a server-side re-authentication step for deletion.

## Mood check-ins

The check-in page offers Tired, Stressed, Okay, and Good. A 220-character note is optional. It stores a mood document and then routes to task selection; a user may skip directly to task selection. Pre-task records do not receive a `phase` field in current code.

After completion, the focus UI offers Better, Proud, Calm, Tired, Same, and Still stressed plus an optional free-text note. It writes a separate mood record with `phase: "after_focus"` and task context. The focus-session document is not updated with the reflection by the current UI.

## Tasks and focus sessions

- A task title must be at least three characters and is capped at 100 by the UI.
- Available duration is 1 minute–24 hours. The duration picker offers presets, scrollable hour/minute wheels, and an exact-minutes keyboard fallback.
- A normal start first writes an active `tasks` record, then writes an active `focusSessions` record.
- Active sessions count down in the browser and checkpoint focus progress every 15 seconds. Displays switch to `H:MM:SS` for sessions lasting an hour or longer.
- After 90 minutes of continuous focus, OneStep pauses and offers a 5, 10, or 15-minute break. Completed sessions offer the same break choices before the next session.
- Pause/resume, completed, interrupted, and cancelled states are stored through focus-session transactions.
- The end dialog can continue, save as completed, or mark the task/session cancelled while retaining elapsed progress in session history.
- A reset changes local timer state but is not a dedicated persisted reset operation until a later session update occurs.
- Completion plays an MP3 unless the user disabled the local sound preference.

The implementation allows one unfinished focus session through client/service checks, but task and session writes are not atomic. A failed session creation can leave an active task record.

## Dashboard, history, and updates

- Dashboard queries all current user's tasks, moods, and focus sessions, then calculates values for the local calendar day in the browser.
- It restores the latest unfinished session and may mark stale active sessions interrupted.
- History lists sessions in descending date order and looks up after-focus mood records by task ID.
- The update prompt polls the version endpoint every five minutes and asks the user to reload when its bundled version differs from the server value.

## PWA and browser features

The manifest describes a standalone installable app. The install button depends on the browser's install-prompt event. The service worker registers only in production and uses a network-first cache. See [PWA.md](../deployment/PWA.md); it does not implement push notifications, offline writes, or guaranteed offline operation.
