# Third-party services and integrations

This inventory is based on imports and dependency declarations. It does not confirm contracts, account ownership, enabled products, regions, data-processing terms, or deployed configuration.

| Service or package | Observable use | Data or configuration involved |
| --- | --- | --- |
| Firebase Authentication | Email/password creation and sign-in, Google popup sign-in, ID tokens, session-cookie creation through Firebase Admin, password update, account deletion | Account credentials and identity data are handled by Firebase; provider settings are outside the repository |
| Cloud Firestore | Browser-side profile/task/mood/focus-session reads and writes; Admin-side OTP, export, and deletion operations | User IDs and application records; rules, indexes, and region are not tracked |
| Resend | Server sends verification, password-reset, and welcome messages using React Email templates | `RESEND_API_KEY`, sender, recipient email, name, and OTP/email content; sender/domain verification is untracked |
| Vercel Analytics | `<Analytics />` renders in the application root layout | Provider collection/configuration is not declared in source |
| Vercel | Mentioned by dependencies and legacy documentation as a hosting target | No `.vercel` directory, Vercel project config, deployment history, or environment inventory is tracked |
| GitHub Actions | Playwright workflow runs on GitHub-hosted Ubuntu | Repository checkout, dependencies, and generated Playwright report artifact |

## Not currently implemented

No source code sends push notifications, uses Firebase Cloud Messaging, integrates advertising, uses a payment provider, implements a CRM/helpdesk, invokes an AI service, or configures an error-monitoring SDK. A static completion sound is played in the browser when a focus session completes; this is not a notification service.

## Provider review questions

Before making privacy or security commitments, determine the deployed Firebase project and Firestore region, Resend sender/domain status, Vercel Analytics settings, hosting logs, provider retention, data-transfer terms, and whether browser cache entries can include authenticated responses. None of those answers are in this repository.
