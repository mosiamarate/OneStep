# Backup and recovery

## Repository evidence

No Firebase backup/export schedule, Firestore restore configuration, Vercel backup policy, Resend retention setting, database snapshot, encrypted backup artifact, or restoration test is stored in the repository. There is also no source-controlled Firestore rule/index deployment package to reconstruct a Firebase environment exactly.

## Application-level behavior

- Data export is an on-demand user download, not a system backup. It includes one user's profile, tasks, moods, and focus sessions only.
- Account deletion intentionally deletes matching application records and the Firebase Auth account. There is no restore endpoint or administrative restoration tool.
- Focus-session recovery can reopen an unfinished Firestore record, but it cannot recover a deleted or corrupted record.
- Browser service-worker cache entries may exist locally and are not managed as a backup or recovery store.

## Required decisions before promising recovery

Define provider-level backup/restore capability, data scope, retention, ownership, encryption, test cadence, RPO, RTO, access controls, and how restores avoid overwriting newer data. Version-control Firestore rules/indexes and document the actual deployment target. Test a recovery procedure with approved non-production data and retain the result where operations can access it.

Until those actions occur, do not state that OneStep has backups, point-in-time recovery, disaster recovery, or recoverable deletion.
