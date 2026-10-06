# Contributing to OneStep

## Scope and baseline

This repository uses Next.js, TypeScript, ESLint, and Playwright. The GitHub workflow runs on pushes and pull requests targeting `main` or `master`; it installs dependencies with `npm ci`, installs Playwright browsers, and runs `npx playwright test`.

There is no checked-in branch-protection rule, review policy, issue template, or commit-message convention. Do not represent any of those as enforced.

## Local checks

From `onestep/`:

```bash
npm ci
npm run lint
npm run build
npx playwright test
```

The Playwright configuration starts `npm run dev` at `http://localhost:3000`. Its current suite contains duplicate landing-page coverage only; see [testing documentation](docs/development/TESTING.md) before treating it as application coverage.

## Change expectations

- Keep documentation aligned with checked-in behavior and configuration.
- Do not commit `.env*`, Firebase Admin service-account files, or generated reports; `.gitignore` excludes them.
- Keep server credentials out of variables prefixed `NEXT_PUBLIC_`.
- For authentication, authorization, retention, or PWA-cache changes, update the relevant documentation and tests in the same change when possible.
- Preserve unrelated working-tree changes. This repository may contain local configuration required to run Firebase or email features.
