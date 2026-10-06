# Data model

This is the Firestore shape written and read by the checked-in client and route handlers. Firestore has no checked-in schema, rules, indexes, or migration files; fields may therefore vary in existing records. Timestamps below are Firestore server timestamps unless noted.

## `users/{uid}`

Email/password signup writes `uid`, `fullName`, `email`, `provider: "password"`, `emailOtpVerified: false`, `createdAt`, and `updatedAt`. Google sign-in merges `uid`, `fullName`, `email`, `photoURL` (signup flow), `provider: "google"`, `emailOtpVerified: true`, `isNewUser`, `updatedAt`, and `lastLoginAt`.

Profile editing merges `uid`, `email`, `displayName`, `fullName`, and `updatedAt`. Successful email OTP verification merges `emailOtpVerified`, `emailVerified`, `emailOtpVerifiedAt`, and `updatedAt`.

## `tasks/{taskId}`

Task creation writes:

```ts
{
  userId, title, durationMinutes,
  completed: false, status: "active", createdAt
}
```

Completion writes `completed: true`, `status: "completed"`, `completedAt`, and `updatedAt`. Ending without completion writes `status: "cancelled"`, `endedAt`, `remainingSeconds`, and `updatedAt`.

## `focusSessions/{sessionId}`

New sessions contain `userId`, `taskId`, `taskTitle`, `status: "active"`, `originalDuration`, legacy duration fields (`duration`, `durationMinutes`), `remainingTime`, `remainingSeconds`, `focusedSeconds: 0`, `actualDuration: 0`, `interruptionCount: 0`, state timestamps, `completed: false`, `interrupted: false`, and `createdAt`. The supported duration range is 1 minute through 24 hours.

Allowed stored states are `active`, `paused`, `interrupted`, `completed`, and `cancelled`. The client checkpoints an active session every 15 seconds. Completion sets the focused duration to the full original duration. A stale active record can be changed to `interrupted` by the client when its `lastActiveAt` is more than 30 seconds old. This is client-side recovery behavior, not a background process.

`normalizeFocusSession` also reads older fields such as `durationMinutes`, `duration`, `actualDuration`, `remainingSeconds`, `completed`, and `interrupted` for compatibility.

## `moods/{moodId}`

The pre-task mood page writes `userId`, `mood`, `moodLabel`, optional `note`, and `createdAt`. It does **not** currently set a `phase` field.

The after-session reflection UI writes `userId`, `mood`, `moodLabel`, optional `note`, `phase: "after_focus"`, `taskId`, `taskTitle`, `durationMinutes`, and `createdAt`. It does not call the existing `updateFocusReflection` helper, so reflections are currently associated through the mood record rather than being persisted on the focus-session record.

## `emailOtps/{purpose}_{uid}`

The active purposes are `EMAIL_VERIFICATION` and `PASSWORD_RESET`. Each document holds `uid`, lower-cased `email`, a SHA-256 `otpHash`, `purpose`, `attempts`, `expiresAt`, `createdAt`, and `used`; failed attempts add `lastAttemptAt`, and successful validation briefly adds `usedAt` before the handler deletes the record.

There is no tracked TTL policy or job that removes unused, expired OTP records. The delete-account handler queries OTPs by `uid`.

## Query and deletion behavior

The dashboard, history, export, and deletion features locate task, mood, and focus-session records by `userId == uid`. Account deletion deletes `users/{uid}` and batches up to 100 matching documents recursively for `tasks`, `moods`, `focusSessions`, and `emailOtps`, then deletes the Firebase Auth user. It cannot establish the fate of provider backups or data outside those collections.
