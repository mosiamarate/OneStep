# Disaster recovery

## Current status

No disaster-recovery plan, recovery objective, backup configuration, restore procedure, infrastructure-as-code, incident contact list, or deployment rollback configuration is tracked in this repository. This document is an evidence-based operator checklist, not proof that recovery capability exists.

## What can be recovered in the application UI

The focus flow keeps an unfinished focus-session record in Firestore. The dashboard and focus page can load the most recent active, paused, or interrupted record. A focus page marks an active record interrupted when its `lastActiveAt` is more than 30 seconds old. Users can resume or cancel an unfinished record.

This is session-state recovery only. It is not a backup, is client initiated, and depends on Firestore access and records being intact.

## What cannot be established

- Whether Firebase Auth or Firestore backups, point-in-time recovery, exports, or multi-region replicas are enabled.
- Whether Vercel has a rollback target, retained builds, logs, or custom-domain recovery plan.
- Whether Resend message history or sender configuration can be recovered.
- Whether browser service-worker caches contain recoverable or stale personal data.
- Whether account-deletion operations can be restored. The code deletes records and has no restore workflow.

## Operator actions to define before relying on recovery

1. Identify the deployed Firebase project, Firestore database, hosting project, and account owners.
2. Document provider backup/restore capabilities, retention, RPO, RTO, access controls, and restore authorization.
3. Version-control Firebase rules/indexes and deployment configuration so a known-good configuration can be reapplied.
4. Create a tested runbook for credential loss, bad deployment rollback, accidental deletion, Firestore-rule regression, and service-worker cache rollback.
5. Test restore only against non-production data or an approved recovery exercise, then record results outside this source-level document.
