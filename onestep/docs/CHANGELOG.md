# Changelog

All notable changes to OneStep are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-08-08

### Added

#### Account Management

- Added a dedicated account settings experience.
- Added user profile management.
- Users can update their display name.
- Added account information display, including the registered email address and account information.
- Added synchronization between the user's Firebase Authentication profile and their Firestore profile data.
- Added account deletion functionality.
- Added a dedicated Danger Zone for destructive account actions.
- Added confirmation protection requiring the user to explicitly confirm account deletion.
- Added personal data export functionality.
- Users can export their OneStep data as a JSON file.
- Added settings navigation for profile, account, and data management.

#### Focus Session Experience

- Redesigned "End Session" flow with confirmation dialog to prevent accidental progress loss.
- Added confirmation options: "Continue Session", "I Completed My Task", and "End Without Completing".
- Interrupted focus sessions are saved to Firestore with actual duration completed so far (`actualDuration`, `interrupted: true`, `status: "interrupted"`).
- Updated history log to differentiate between Completed and Interrupted focus sessions.
- Added progress-saving feedback toasts upon ending session.

#### Data Management

- Added support for users to manage their personal OneStep data.
- Added support for permanently deleting an account and its associated user data.
- Added support for exporting personal application data.

### Security

- Added server-side authentication checks for account management operations.
- Account management operations use the authenticated user's identity rather than trusting a user ID supplied by the client.
- Added server-side handling for privileged Firebase operations.
- Added logout token-based session expiry to prevent stale authenticated sessions from remaining valid indefinitely.
- Added server-side session expiry enforcement in route protection middleware.
- Added rate limiting to authentication and OTP-related API endpoints.
- Added authentication and email-verification requirements to protected account settings.

### Changed

- Updated the application version to `1.1.0`.
- Improved user profile synchronization across the application.
- Improved display-name handling throughout authenticated areas of OneStep.
- Improved the settings experience and navigation.

---

## [1.0.3] - 2026-08-08

### Added

#### Transactional Email System

- Added Resend as the transactional email service for OneStep.
- Added server-side email sending through Next.js API routes.
- Added custom OneStep-branded authentication email templates.
- Added React Email templates for transactional messages.
- Added support for custom verification and password-reset email content.

#### OTP Authentication

- Added One-Time Password (OTP) functionality for email verification.
- Added OTP-based account verification after registration.
- Added OTP-based password reset flow.
- Added OTP resend functionality.
- Added OTP expiration handling.
- Added protection around OTP verification attempts.
- Added secure server-side OTP handling.

#### Email Verification

- Added a dedicated email verification page.
- Added verification-code input and validation.
- Added support for resending verification codes.
- Added email-verification checks for protected areas of the application.

### Security

- Added Firebase Admin SDK support for trusted server-side authentication operations.
- Separated privileged Firebase operations from client-side Firebase functionality.
- Added server-side authentication checks for sensitive authentication operations.
- Prevented privileged authentication logic from being exposed to the client.
- Added environment-based configuration for Resend and Firebase Admin credentials.

### Fixed

- Fixed production authentication email delivery issues.
- Fixed Firebase Admin SDK credential configuration.
- Fixed Firebase Admin authentication and service-account configuration issues.
- Fixed server-side password-reset failures.
- Fixed environment variable loading issues affecting Firebase and authentication.
- Fixed API responses that were incorrectly returning HTML instead of JSON.
- Fixed authentication-related server errors encountered during production testing.
- Improved compatibility between the authentication email system and the production environment.

---

## [1.0.2] - 2026-08-05

### Added

#### Focus History

- Added the History page for reviewing previous focus sessions.
- Added support for displaying historical focus activity.
- Connected focus-session records with the user's personal history.
- Restricted history data to the authenticated user's own records.

#### Application Update System

- Added application version tracking.
- Added an application version API endpoint.
- Added support for detecting when a newer version of OneStep is available.
- Added an update notification that informs users when a new application version is available.
- Added support for prompting users to refresh the application after an update.
- Added version management for future application releases.

#### Security Improvements

- Strengthened Firestore access controls for user-owned data.
- Improved protection against unauthorized access to another user's information.
- Improved separation between client-side Firebase functionality and privileged Firebase Admin functionality.
- Continued strengthening authentication and authorization checks around protected application functionality.

### Changed

- Updated the application version to `1.0.2`.
- Improved dashboard data handling.
- Improved user-specific data retrieval.
- Improved application update handling for the PWA environment.

### Fixed

- Fixed a TypeScript type mismatch involving the dashboard's latest mood data.
- Fixed issues related to the application update/version API route.
- Fixed production build and type-checking issues encountered while implementing the update system.
- Improved compatibility between the update notification system and the Next.js App Router.

---

## [1.0.1] - 2026-08-02

### Added

#### Progressive Web App

- Improved Progressive Web App support.
- Added PWA installation functionality.
- Added application manifest configuration.
- Added application icons and metadata.
- Added Apple touch icon support.
- Improved the mobile installation experience.
- Improved the application layout for mobile and desktop screen sizes.

#### Focus Experience

- Added customizable focus-session durations.
- Added timer presets.
- Added custom timer duration selection.
- Added pause, resume, and reset functionality.
- Added a mini timer experience for active focus sessions.
- Added a post-focus mood check-in.
- Added support for optional reflection after completing a focus session.

#### Dashboard

- Improved the dashboard to display the user's name instead of their email address where available.
- Improved user-profile data handling.
- Improved dashboard synchronization with Firebase user information.

### Fixed

- Fixed multiple Next.js build and rendering issues.
- Fixed duplicate state declarations.
- Fixed focus timer state initialization issues.
- Fixed the `time` initialization error in the focus timer.
- Fixed Firebase Analytics initialization issues during server-side rendering.
- Fixed Firebase environment variable loading during production builds.
- Fixed dashboard service type errors.
- Fixed password-reset page prerendering issues.
- Fixed Firebase API-key configuration issues.
- Improved Vercel production deployment compatibility.

---

## [1.0.0] - 2026-07-28

### Added

#### Initial Release

- Initial release of the OneStep productivity and focus application.
- Added Firebase Authentication.
- Added email and password registration.
- Added email and password login.
- Added Google Sign-In.
- Added password-reset functionality.
- Added protected application routes.
- Added authenticated dashboard.
- Added mood check-ins.
- Added task creation.
- Added the OneStep single-task workflow.
- Added focus-session functionality.
- Added focus timer functionality.
- Added responsive application interface.
- Added initial Progressive Web App support.
- Added Firestore integration for user and application data.
- Added Vercel production deployment.

---

# Version History

| Version | Date | Release Focus |
|---|---|---|
| **1.1.0** | 2026-08-08 | Account management, data export, account deletion and settings |
| **1.0.3** | 2026-08-08 | Resend, OTP authentication, email verification and authentication email system |
| **1.0.2** | 2026-08-05 | History, application update system and security improvements |
| **1.0.1** | 2026-08-02 | PWA, focus experience, mood reflection and application stability |
| **1.0.0** | 2026-07-28 | Initial OneStep release |

---

## Current Status

**Current Version: `1.1.0`**

OneStep currently provides a complete core productivity workflow combining authentication, task management, mood tracking, focus sessions, personal history, a personalized dashboard, Progressive Web App support, transactional authentication emails, OTP verification, and account management.

Users can create and secure their accounts, verify their email addresses, reset passwords, manage their profile information, export their personal data, and permanently delete their accounts.

The application continues to undergo security hardening, usability improvements, and feature development as OneStep progresses toward a broader public release.