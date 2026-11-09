# Testing

## Current automated tests

The Playwright configuration runs desktop Chromium, Android emulation (Pixel 7/Chromium), and iOS emulation (iPhone 15/WebKit). It starts `npm run dev` at `http://localhost:3000`, uses an HTML reporter, retries twice only in CI, and runs one worker to avoid development-server contention.

Run the mobile layout checks independently with `npm run test:android` or `npm run test:ios`. Add `-- --headed` to open a visible browser during the check. These Playwright device profiles emulate mobile browsers; they do not start native Android or iOS simulators.

For native WebView previews, install the Android SDK/AVD (or macOS/Xcode for iOS), run `npm install`, and generate the platform project once with `npm run native:add:android` or `npm run native:add:ios`. Keep `npm run dev:mobile` running in one terminal, then launch with `npm run native:android` or `npm run native:ios`. Android and iOS simulator builds cannot be launched on this Windows environment unless the required SDK/platform tooling is installed; iOS requires macOS and Xcode. Capacitor is configured to load the development server only when `CAPACITOR_SERVER_URL` is explicitly supplied by these scripts.

The suite includes landing-page checks, auth-page smoke and client-side validation checks, and logged-out protected-route redirects. `tests/auth-policy.spec.ts` directly exercises the OTP-secret requirement and the pure rolling-window rate-limit policy. `tests/focus.spec.ts` no longer pretends to have an authenticated browser session; it verifies the unauthenticated redirect.

`tests/onestep.spec.js` and `tests/example.spec.js` still duplicate landing-page checks and can be consolidated separately.

The GitHub workflow installs dependencies with `npm ci`, installs Playwright browsers with dependencies, runs `npx playwright test`, and uploads `playwright-report/` for 30 days when the run is not cancelled.

## Historical local execution

On 2026-11-08, the full VS Code Playwright run completed with 24 passed and 0 failed. An earlier full run had one Chromium landing-navigation failure; that test passed in isolation and the subsequent full run passed. The focused auth, auth-policy, focus, and protected-route run completed with 16 passed and 0 failed. Editor diagnostics reported no errors in changed TypeScript files; ESLint and a production build could not be run because no terminal was available.

On 2026-09-23, `npm run lint` and `npm run build` passed. The build emitted a non-blocking warning that an outer workspace `package-lock.json` was selected as the Turbopack root. `npx playwright test` ran 12 tests: 8 passed (Chromium and WebKit); all 4 Firefox tests failed during `browserContext.newPage` setup with `Cannot read properties of undefined (reading '_page')`, before an application assertion. This is a local test-environment result, not a diagnosis of Firefox product behavior.

On 2026-10-13, the production build reported TS2345 in `FocusClient.tsx`: the initial break duration inferred the state type as the literal `5`, while restoring a session supplies a general number. The state was widened explicitly to `number`. Editor diagnostics then reported no problems in that file, but a full build could not be rerun in that environment; the current production build result is unverified. The user also observed a Turbopack-root warning caused by an outer workspace lockfile; it is separate from the type error.

## Coverage limits

The repository has no Firebase Emulator Suite configuration, API integration tests, visual-regression tests, accessibility test tooling, load tests, or coverage threshold. Current tests do not prove successful Firebase registration/login/Google popup, end-to-end OTP delivery/expiry/resend, password-reset session revocation, cross-instance Firestore limiter behavior, authenticated API authorization, Firestore rules, export/deletion, or production service-worker behavior. Those require emulator/provider configuration and must not run against production data.

## Recommended verification by change type

| Change | Minimum evidence to add or run |
| --- | --- |
| UI/page behavior | Relevant Playwright test in addition to lint/build |
| Firestore rules/data access | Firebase Emulator tests for unauthenticated, own-user, and cross-user operations |
| API auth/session/OTP | Emulator/API tests for missing, invalid, expired, revoked, and valid credentials; OTP expiry/replay/attempt paths and concurrent resend |
| Export/deletion | Tests for identity derivation, queried collection scope, partial failure, and browser download behavior |
| Service worker | Production-mode browser test or manual Cache Storage inspection after authenticated navigation and export |
| Accessibility | Automated scanner plus keyboard and screen-reader review of changed flows |

Timer changes should also verify the default 25-minute session, a session just over 60 minutes, a session ending exactly at 60 minutes, two-hour and longer sessions, and scheduled prompts at each hourly threshold; hour/minute selector keyboard use; the configured scheduled-break duration and skip action; completed-session break choices; refresh recovery; and mobile layouts at 320px and 390px widths.

`npm run lint` and `npm run build` are useful local checks, but neither validates production Firebase configuration or provider integrations.
