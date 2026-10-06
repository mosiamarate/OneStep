# Technical privacy overview

This is implementation documentation, not a privacy policy, legal advice, or a statement of legal compliance. The user-facing `/privacy` page is separate application content. This document records data handling visible in source and identifies the parts that require provider and operational verification.

## Data handled by the application

| Category | Source-visible fields or behavior |
| --- | --- |
| Account identity | Firebase UID, email address, display/full name, Firebase provider data, optional photo URL, Auth account creation metadata |
| Profile record | `users/{uid}` fields described in [DATA_MODEL.md](../architecture/DATA_MODEL.md) |
| Productivity content | Task title, duration, task status, focus-session timestamps and progress |
| Mood and reflection content | Mood selection, optional note, after-session task context and duration |
| Authentication control data | Email address, hashed OTP, purpose, attempt count, expiry, timestamps, and used flag in `emailOtps` |
| Browser state | Client UI-hint cookies, a completion-sound local-storage preference, Firebase browser SDK state, and service-worker cache entries |
| Export | JSON containing profile, tasks, moods, and focus sessions |

Mood notes and reflections are free text. The code does not classify, encrypt, redact, or apply a separate access path to them; they are stored in Firestore like the other user-created records. The repository does not include Firestore rules, so the effective access restriction cannot be evaluated from source.

## Data flows

- The browser sends account credentials to Firebase Authentication and uses Firebase ID tokens for session and privileged API calls.
- The browser directly writes profile, mood, task, and focus-session records to Firestore using the Firebase Web SDK.
- The server reads/writes OTP, export, and deletion data through Firebase Admin.
- Resend receives recipient email address and the content needed for verification, password-reset, and welcome emails.
- The root layout renders Vercel Analytics. Data collection behavior depends on the provider configuration and is not specified in this repository.
- The service worker stores public shell resources and runtime cache entries in the browser; see [PWA.md](../deployment/PWA.md).

## User-initiated data operations

- **Profile update:** updates Firebase Auth display name and merges selected fields into `users/{uid}`.
- **Export:** `GET /api/account/export` verifies the ID token and returns a JSON attachment. It does not export OTP documents or a provider-backup inventory.
- **Deletion:** `POST /api/account/delete` verifies the ID token, deletes application records found by the documented queries, deletes the Firebase Auth account, and clears the server session cookie. It does not provide a recovery mechanism or evidence about provider backups, logs, caches, or data that is not in the queried collections.

The account settings UI asks the user to type a deletion phrase; the API does not verify that phrase. See [AUTHENTICATION.md](../security/AUTHENTICATION.md).

## Boundaries not established in code

- No data-processing agreement, data residency, legal basis, consent record, age-verification workflow, retention schedule, or privacy-request process is tracked.
- No deletion/retention configuration is tracked for Firebase, Resend, Vercel, Vercel Analytics, browser caches, provider logs, or backups.
- No DLP, content moderation, encryption-key management, or audit-log system is implemented in the repository.

See [DATA_RETENTION.md](DATA_RETENTION.md) and [THIRD_PARTY_SERVICES.md](THIRD_PARTY_SERVICES.md) for the specific technical boundaries.
