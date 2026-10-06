# Product overview

OneStep is a single-task productivity web application. Its core experience is a mood check-in, a focused task, a countdown session, and an optional reflection. It is not implemented as a medical, counselling, emergency, calendar, team-collaboration, or push-notification service.

## Primary users and scope

The landing page describes OneStep for people who want a calmer way to focus on one task. The source does not define user personas, subscription tiers, roles, organizations, shared workspaces, or administrator features.

## Implemented product areas

| Area | Current behavior |
| --- | --- |
| Account access | Email/password and Google popup sign-in; email/password accounts go through code verification |
| Dashboard | Shows today-derived mood/task/focus values, most recent completed focus context, next-step link, and unfinished-session recovery controls |
| Mood check-in | Lets users select Tired, Stressed, Okay, or Good and optionally enter a 220-character note; users can skip to task selection |
| One task | Creates a title of 3–100 characters, a 1-minute–24-hour duration, an active task record, and then a focus-session record |
| Focus | Countdown with hour-aware display, pause/resume, reset, end choices, 15-second active checkpoints, completed/paused/interrupted/cancelled state, optional Picture-in-Picture mini timer, long-session break prompt, optional between-session breaks, and completion sound preference |
| Reflection/history | After a completed session, users can add one of six after-session moods and optional note. History combines session records with matching after-focus mood records. |
| Account settings | Display-name update, sound preference, JSON data export, and account deletion request |
| PWA | Manifest, install prompt when browser support permits, service worker, and version-refresh prompt |

## Boundaries

The normal UI does not implement task lists, task editing, repeating tasks, tags, calendar integration, teams, reminders, push notifications, server-side analytics reports, achievement systems, or a recovery-mode product feature. A completion sound and document Picture-in-Picture mini timer are available only when browser behavior permits.

Focus, mood, and profile records depend on deployed Firestore rules that are not present in source. See [FEATURES.md](FEATURES.md) and [USER_FLOWS.md](USER_FLOWS.md) for precise behavior.
