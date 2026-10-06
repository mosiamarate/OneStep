# Changelog

All notable changes to OneStep are documented in this file. Release notes describe repository history; they are not a claim that a particular deployment received every change.

## [1.2.0] - 2026-08-29

### Added

- Added a client-side update prompt that compares the bundled `APP_VERSION` with `GET /api/app-version` and offers a page refresh when they differ.

### Changed

- Updated the application version to `1.2.0`.

## [1.1.0] - 2026-08-08

### Added

#### Account management

- Added settings pages for profile, account security, and data export.
- Added display-name updates in Firebase Authentication and Firestore.
- Added a JSON data export route for the authenticated user's profile, tasks, mood records, and focus sessions.
- Added an account deletion route that deletes the Firebase Authentication user and queried Firestore records for that user.
- Added a client-side confirmation phrase before the account-deletion request is sent.

#### Focus session experience

- Added an end-session dialog with options to continue, mark a task complete, or end without completing.
- Added persisted focus-session states for completed, interrupted, and cancelled sessions.
- Added history labels for completed, interrupted, and early-ended sessions.

### Security-related changes

- Added Firebase Admin SDK route handlers for account export and deletion.
- Added Firebase Admin session-cookie creation and proxy-based route checks.
- Added in-process, action-scoped rate-limit checks to authentication and sensitive account routes.

## [1.0.3] - 2026-08-08

### Added

- Added Resend-backed verification, password-reset, and welcome email delivery.
- Added six-digit OTP verification for email/password signup and password reset.
- Added verification-code resend routes and a verification page.

### Fixed

- Recorded fixes to Firebase Admin credential handling, route responses, and production authentication email delivery.

## [1.0.2] - 2026-08-05

### Added

- Added the focus-history page and user-scoped history queries.
- Added the application-version API endpoint and update prompt infrastructure.

## [1.0.1] - 2026-08-02

### Added

- Added the web app manifest, install prompt, icons, and service-worker registration.
- Added duration selection, timer pause/resume/reset controls, a document Picture-in-Picture mini timer, and an after-session mood prompt.

## [1.0.0] - 2026-07-28

### Added

- Initial release with Firebase Authentication, Google sign-in, mood check-ins, task creation, focus sessions, Firestore persistence, and a responsive interface.

## Version history

| Version | Date | Release focus |
| --- | --- | --- |
| 1.2.0 | 2026-08-29 | Update prompt and version bump |
| 1.1.0 | 2026-08-08 | Account settings, export, deletion, and focus-session states |
| 1.0.3 | 2026-08-08 | Resend emails and OTP flows |
| 1.0.2 | 2026-08-05 | History and version endpoint |
| 1.0.1 | 2026-08-02 | PWA and focus-session controls |
| 1.0.0 | 2026-07-28 | Initial application |
