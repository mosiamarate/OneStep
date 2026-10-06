# Deployment

## Evidence boundary

This repository contains a Next.js application and a Vercel Analytics integration, but it does not contain a Vercel project directory, deployment configuration, environment inventory, deployment history, custom domain configuration, Firebase configuration, Firestore rules, or Firestore indexes. It therefore cannot describe a verified production deployment.

## Build and runtime requirements

Use the commands declared in `package.json`:

```bash
npm ci
npm run lint
npm run build
npm start
```

The Admin-backed route handlers explicitly request the Node.js runtime. A deployment needs the Firebase public configuration for browser code, Firebase Admin credentials for the session/OTP/export/deletion handlers, and Resend configuration for email delivery. See [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md).

## Deployment checklist

1. Set the documented public and server-only variables in the hosting environment; do not expose server values as `NEXT_PUBLIC_` variables.
2. Verify Firebase Authentication provider configuration and authorized domains in Firebase Console.
3. Export, review, version-control, and deploy Firestore rules and required indexes. The browser application depends on them for data authorization.
4. Configure and verify the Resend sender/domain before enabling verification and reset flows.
5. Set a unique high-entropy `OTP_SECRET`; source otherwise falls back to weaker values.
6. Run lint, build, and the relevant tests. The current test suite is not coverage of auth, Firestore, or APIs.
7. Inspect service-worker behavior after deployment. It registers only when `NODE_ENV === "production"` and its current cache policy can retain same-origin GET responses.
8. Verify the host's logs, alerting, backups, incident contacts, TLS policy, and external headers. None are established by source control.

## Application headers

The Next config adds `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()`. It does not configure CSP or HSTS. Confirm any platform-added headers in the deployed response rather than assuming they exist.

## Post-deploy checks

At minimum, verify a public landing page, email/password and Google sign-in, email verification, password reset, protected-route redirects, profile update, task/focus persistence, export, deletion on a non-production test account, and service-worker cache contents. These are recommended operational checks; no automated smoke-test deployment gate is tracked.
