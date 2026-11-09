# OneStep

OneStep is a Next.js productivity application built around a short, single-task flow: an authenticated user can check in on their mood, create a task, run a focus session, optionally add an after-session reflection, and view focus history.

This README is the repository entry point. The implementation-oriented documentation lives in [docs/README.md](docs/README.md).

## Current implementation

- Email/password and Google sign-in are provided by Firebase Authentication.
- Email/password accounts are verified with a six-digit email code sent through Resend. Password reset also uses a six-digit code.
- The browser reads and writes user profiles, mood check-ins, tasks, and focus sessions directly to Firestore. The checked-in repository does **not** contain Firestore rules or indexes, so the deployed authorization rules cannot be reviewed here.
- Next.js route handlers create a 24-hour Firebase Admin session cookie, deliver email codes, export data, delete accounts, and expose the application version.
- The production-only service worker pre-caches a small public shell and caches only public static assets; it excludes API and authenticated navigation responses. See [PWA documentation](docs/deployment/PWA.md) for its limitations.
- Vercel Analytics is rendered in the root layout; Resend is used for transactional authentication and welcome emails.

The project is not represented here as security-audited, legally compliant, or production-ready. Those determinations require configuration and operational evidence outside this repository.

## Repository layout

```text
src/                 Next.js application, route handlers, Firebase clients, and UI
public/              Icons, completion sound, and service worker
tests/               Playwright landing-page tests
docs/                Engineering, product, security, privacy, deployment, and audit docs
.github/workflows/   Playwright CI workflow
```

## Local development

```bash
npm ci
npm run dev
```

Copy the public Firebase variables from `.env.example` into a local environment file. Authentication email routes, server-side session handling, data export, and account deletion also need server-side Firebase Admin credentials; email flows additionally need Resend configuration. The complete variable inventory and current fallbacks are in [Environment Variables](docs/deployment/ENVIRONMENT_VARIABLES.md).

Available package scripts are:

```bash
npm run dev
npm run lint
npm run build
npm start
```

The full Playwright suite can be run with `npx playwright test` after its browsers are installed.

To check the mobile landing and signup layouts in Playwright's Android and iOS browser emulation, run:

```bash
npm run test:android
npm run test:ios
```

These use a Pixel 7 Chromium profile and an iPhone 15 WebKit profile; they emulate mobile browsers and are not substitutes for native Android Studio or Xcode simulators. Add `-- --headed` to either command to watch the test in a browser window.

## Native emulator preview

The optional Capacitor wrapper loads the running Next.js app in an Android or iOS WebView. Install the Android SDK and create an Android Virtual Device in Android Studio for Android. iOS simulator builds require macOS and Xcode; they cannot be built or launched from Windows.

Install dependencies, then generate the native project once:

```bash
npm install
npm run native:add:android
# On macOS with Xcode:
npm run native:add:ios
```

In one terminal run `npm run dev:mobile`. In another, launch `npm run native:android` or (on macOS) `npm run native:ios`. The commands configure the emulator's development-server address (`10.0.2.2` on Android, `localhost` on the iOS simulator). These are development-only HTTP URLs; do not ship a build configured with `CAPACITOR_SERVER_URL`. Native projects are generated locally and are not part of this web app's checked-in source.

## Documentation

Start with [docs/README.md](docs/README.md). In particular:

- [Architecture](docs/architecture/ARCHITECTURE.md) and [data model](docs/architecture/DATA_MODEL.md)
- [Authentication](docs/security/AUTHENTICATION.md) and [security limits](docs/security/SECURITY.md)
- [Data retention](docs/privacy/DATA_RETENTION.md) and [third-party services](docs/privacy/THIRD_PARTY_SERVICES.md)
- [Development](docs/development/DEVELOPMENT.md), [testing](docs/development/TESTING.md), and [deployment evidence](docs/deployment/DEPLOYMENT.md)
- [Authentication audit](docs/audits/AUTHENTICATION_AUDIT.md)
- [Production-readiness assessment](docs/audits/PRODUCTION_READINESS.md)

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md). This repository does not grant an open-source license; see [LICENSE](LICENSE).

## Version history

Release notes are maintained in [CHANGELOG.md](CHANGELOG.md).
