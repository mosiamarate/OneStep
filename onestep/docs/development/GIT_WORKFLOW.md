# Git and CI workflow

## What is configured

The repository has one tracked workflow: `.github/workflows/playwright.yml`.

- It runs on pushes and pull requests for `main` and `master`.
- It checks out source, uses the latest Node LTS selector, runs `npm ci`, installs Playwright browsers, runs `npx playwright test`, and uploads the HTML report for 30 days.

## What is not configured

No checked-in configuration establishes branch protection, required checks, pull-request approval count, code ownership, release automation, semantic versioning enforcement, changelog generation, deployment promotion, secret scanning, dependency review, or artifact signing.

## Working-tree hygiene

The existing `.gitignore` excludes environment files, Firebase Admin credentials, dependencies, Next output, and Playwright reports. Keep those exclusions intact and inspect `git status` before committing. In particular, local Firebase service-account JSON is ignored and must not be copied into source, test fixtures, documentation, or CI artifacts.

The repository may have unrelated local edits. Preserve them; do not reset or overwrite files outside the scope of the intended change.
