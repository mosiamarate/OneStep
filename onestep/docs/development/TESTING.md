# Testing

## Current automated tests

`tests/onestep.spec.js` and `tests/example.spec.js` contain the same two Playwright tests:

- the landing page loads with the expected title and heading;
- the Get Started link points to `/auth/signup`, and the signup heading is visible.

`playwright.config.js` runs Chromium, Firefox, and WebKit projects. It starts `npm run dev` at `http://localhost:3000`, uses an HTML reporter, retries twice only in CI, and runs tests in parallel except with one worker in CI.

The GitHub workflow installs dependencies with `npm ci`, installs Playwright browsers with dependencies, runs `npx playwright test`, and uploads `playwright-report/` for 30 days when the run is not cancelled.

## Most recent local execution

On 2026-09-23, `npm run lint` and `npm run build` passed. The build emitted a non-blocking warning that an outer workspace `package-lock.json` was selected as the Turbopack root. `npx playwright test` ran 12 tests: 8 passed (Chromium and WebKit); all 4 Firefox tests failed during `browserContext.newPage` setup with `Cannot read properties of undefined (reading '_page')`, before an application assertion. This is a local test-environment result, not a diagnosis of Firefox product behavior.

## Coverage limits

The repository has no tracked unit-test framework, component test suite, Firebase Emulator suite, API integration tests, visual-regression tests, accessibility test tooling, load tests, or coverage threshold. The current Playwright files duplicate each other and do not exercise authenticated routes, Firestore rules, route handlers, export/deletion, OTP behavior, or PWA cache behavior.

## Recommended verification by change type

| Change | Minimum evidence to add or run |
| --- | --- |
| UI/page behavior | Relevant Playwright test in addition to lint/build |
| Firestore rules/data access | Firebase Emulator tests for unauthenticated, own-user, and cross-user operations |
| API auth/session/OTP | Tests for missing, invalid, expired, revoked, and valid credentials; OTP expiry/replay/attempt paths |
| Export/deletion | Tests for identity derivation, queried collection scope, partial failure, and browser download behavior |
| Service worker | Browser test or manual inspection of Cache Storage, including authenticated/export requests |
| Accessibility | Automated scanner plus keyboard and screen-reader review of changed flows |

Timer changes should also verify 25-minute, 90-minute, and multi-hour sessions; hour/minute selector keyboard use; the 90-minute break prompt; completed-session break choices; refresh recovery; and mobile layouts at 320px and 390px widths.

`npm run lint` and `npm run build` are useful local checks, but neither validates production Firebase configuration or provider integrations.
