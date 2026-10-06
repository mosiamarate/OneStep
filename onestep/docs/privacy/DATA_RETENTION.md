# Data retention and deletion

## What the source implements

| Data | Current behavior |
| --- | --- |
| Firebase Auth account | Deleted by `POST /api/account/delete` after the Firestore deletion operations complete |
| `users/{uid}` | Directly deleted by that endpoint |
| Tasks, moods, focus sessions, OTPs | Matching records are queried by verified UID and deleted in recursive batches of 100 |
| Used OTP | Deleted after a successful verification or reset flow |
| Expired/unused OTP | Code rejects expired values, but no checked-in TTL policy, scheduled cleanup, or background job removes the record automatically |
| User export | Generated on demand as an HTTP attachment; no export archive is written by the route |
| Session cookie | Server cookie has a 24-hour maximum age; client UI-hint cookies have a seven-day maximum age |
| Completion-sound preference | Stored in browser local storage until the user/browser removes it |
| Service-worker cache | Persists in browser Cache Storage until cache replacement, browser clearing, or worker behavior removes it |

## Scope of account deletion

The handler targets the Firestore collections used by this application (`users`, `tasks`, `moods`, `focusSessions`, and `emailOtps`) and Firebase Authentication. It cannot prove deletion from:

- Firebase, Vercel, Resend, analytics, browser, or hosting logs;
- provider backups, snapshots, replicas, or retention systems;
- cached copies in a user's browser or device;
- untracked collections, third-party systems, or data created outside the documented queries.

The endpoint does not support restoration. Failure handling can leave partial deletion if a step fails; no reconciliation job or deletion audit record is tracked.

## Retention status

No source-controlled retention schedule, automated backup policy, legal hold process, or provider retention configuration is available. Accordingly, this repository cannot support a claim that data is retained for a defined number of days or that deletion is complete across all systems.

Before setting a retention commitment, define it with the service owner and verify the provider settings, backups, logs, Firestore TTL behavior, service-worker cache behavior, and the actual Firestore rules. See [BACKUP_AND_RECOVERY.md](../operations/BACKUP_AND_RECOVERY.md).
