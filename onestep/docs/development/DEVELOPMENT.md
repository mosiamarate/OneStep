# Development

## Prerequisites

The repository declares npm scripts but does not pin a Node.js version in `.nvmrc`, `package.json` engines, or CI. The GitHub Actions workflow uses `node-version: lts/*`. Use a current compatible Node LTS and npm, then install from the lockfile:

```bash
npm ci
```

## Local environment

`.env.example` contains only the six public Firebase variables. Copy it to a local ignored environment file and add values appropriate to the features you exercise. Server authentication and account routes need Firebase Admin credentials; Resend email routes need a Resend key. Do not print secrets or commit environment files.

See [ENVIRONMENT_VARIABLES.md](../deployment/ENVIRONMENT_VARIABLES.md) for the authoritative inventory, fallbacks, and the currently unused environment-schema module.

## Commands

| Command | Current behavior |
| --- | --- |
| `npm run dev` | Starts Next.js development server |
| `npm run build` | Creates a production Next.js build |
| `npm start` | Starts the production server after a build |
| `npm run lint` | Runs ESLint |
| `npx playwright test` | Runs the configured Playwright suite; no npm test script exists |

## Application boundaries in local work

- `src/lib/firebase.ts` is the browser Firebase Web SDK initialization.
- `src/lib/firebaseAdmin.ts` initializes Firebase Admin on the server; import through `src/lib/firebase-admin.ts` where existing code does so.
- `src/services` contains browser-side Firestore query and focus-session helpers.
- `src/app/api` contains Node.js route handlers for privileged server work.
- `src/proxy.ts` performs server-side route navigation checks; client components also use `ProtectedRoute`.

Because data pages make direct Firestore requests from the browser, a local environment requires Firestore rules that permit the intended development flow. Those rules are not stored in this repository, so do not infer or silently recreate production authorization from the client code.

## Documentation maintenance

When changing code, update the corresponding implementation document: data fields in [DATA_MODEL.md](../architecture/DATA_MODEL.md), auth flow in [AUTHENTICATION.md](../security/AUTHENTICATION.md), provider usage in [THIRD_PARTY_SERVICES.md](../privacy/THIRD_PARTY_SERVICES.md), caching in [PWA.md](../deployment/PWA.md), and observable test coverage in [TESTING.md](TESTING.md).
