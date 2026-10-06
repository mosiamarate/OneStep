# Technology stack

Versions below distinguish the declared dependency range from the locally resolved package when it was observed during the 2026-09-23 build. Caret ranges can resolve newer compatible releases.

| Area | Implementation |
| --- | --- |
| Application framework | Next.js `^16.2.12` declared; local build resolved `16.3.2`; App Router |
| UI | React `19.2.3`, TypeScript `^5` (local `5.9.3`), Tailwind CSS `^4.3.1` (local `4.3.3`), Lucide React |
| Authentication and database | Firebase Web SDK `^12.10.0` (local `12.10.0`), Firebase Admin SDK `^14.2.0` (local `14.3.0`), Firebase Authentication, Cloud Firestore |
| Email | Resend `^6.18.1` (local `6.18.1`), React Email and `@react-email/components` |
| Analytics integration | `@vercel/analytics/react` is rendered in the root layout |
| Testing | Playwright `^1.62.1` (local `1.62.1`) |
| Linting | ESLint `^9` (local `9.39.4`) with `eslint-config-next` core-web-vitals and TypeScript configurations |
| PWA assets | Next metadata manifest and a hand-written `public/sw.js` |

## Deliberately not inferred

The repository does not include a Vercel project configuration, Firebase project configuration, Firestore rules, Firestore indexes, telemetry dashboards, error-monitoring integration, push-notification integration, container configuration, or infrastructure-as-code. Dependency presence alone does not establish provider configuration or deployment status.

## Configuration observations

`next.config.ts` sets `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and a camera/microphone/geolocation `Permissions-Policy`. It does not configure a Content Security Policy, HSTS, or deployment headers outside Next.js.

The only tracked CI workflow is `.github/workflows/playwright.yml`; it runs Playwright tests on GitHub-hosted Ubuntu for pushes and pull requests to `main` and `master`.
