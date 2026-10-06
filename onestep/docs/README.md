# OneStep engineering documentation

This documentation describes the checked-in application under `onestep/` as inspected on 2026-09-23. It distinguishes observable implementation from configuration and operations that are not present in the repository.

The source files, package manifest, GitHub workflow, and existing history are the technical evidence for these documents. Firebase Console settings, Firestore rules and indexes, Resend domain status, deployed Vercel settings, production logs, backups, and external legal assessments are not available here unless stated otherwise.

## Map

- [Architecture](architecture/ARCHITECTURE.md): component boundaries, Firestore data shape, and dependency stack.
- [Security](security/SECURITY.md): controls in code, threat model, authentication, and verification checklist.
- [Privacy](privacy/PRIVACY.md): technical data handling, retention limits, and third-party integrations.
- [Development](development/DEVELOPMENT.md): local setup, code conventions, tests, and GitHub workflow.
- [Deployment](deployment/DEPLOYMENT.md): deployable configuration, environment variables, PWA behavior, and recovery limits.
- [Operations](operations/INCIDENT_RESPONSE.md): operational runbooks based on what is and is not configured.
- [Product](product/PRODUCT_OVERVIEW.md): actual features and flows.
- [Audits](audits/PRODUCTION_READINESS.md): source-level readiness, security, accessibility, and performance assessments.

## Source-of-truth rules

- Root [README](../README.md) is the project entry point.
- Root [CHANGELOG](../CHANGELOG.md) preserves release history.
- Root [SECURITY](../SECURITY.md) is the repository security-policy entry point.
- These documents do not duplicate the user-facing `/privacy` or `/terms` pages and do not make legal, compliance, audit, or availability guarantees.

## Historical migration

The former `docs/authentication-email-system.md` and `docs/user-account-management.md` were decomposed into the authentication, privacy, product, and data-model documents so that each topic has one current source of truth. The former production-readiness audit is maintained as [audits/PRODUCTION_READINESS.md](audits/PRODUCTION_READINESS.md). The changelog moved to the repository root.
