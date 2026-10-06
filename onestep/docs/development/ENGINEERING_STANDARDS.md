# Engineering standards

These are standards derived from the current codebase and documentation-maintenance needs. They do not describe a configured review gate or a formal software-development lifecycle.

## Existing technical conventions

- TypeScript is configured with `strict: true`, `noEmit: true`, and Next.js type integration.
- ESLint uses Next core-web-vitals and TypeScript configurations. The only lint script is `eslint`.
- App Router pages and route handlers live under `src/app`; client components use the `"use client"` directive.
- Browser Firebase code is separate from Admin code. Server modules use `server-only` to avoid client imports of Admin/Resend dependencies.
- Firestore records are mostly untyped `Record<string, unknown>` at read boundaries and normalized for focus-session/history rendering.
- Sensitive route handlers derive the user from a verified Firebase ID token rather than accept a target UID in the request body.

## Required care points

1. Keep browser and server trust boundaries explicit. Never import Firebase Admin, Resend keys, or server credential code from a client component.
2. Treat Firestore query filters as retrieval logic, not sufficient authorization. Any Firestore-rule change needs rules in source control and emulator tests before a security claim can be updated.
3. Keep data-model changes backward-compatible or update the normalizers and export/history/dashboard behavior together.
4. Do not claim code is encrypted, compliant, audited, monitored, backed up, or deployed unless the relevant configuration or evidence is available.
5. Update root and `docs/` links when moving documentation; avoid parallel documents covering the same authoritative topic.
6. Keep secrets in server-side environment variables. Never use `NEXT_PUBLIC_` for Admin credentials, Resend keys, or OTP secret material.

## No established standard

The repository does not define a formatter, coverage threshold, code-owner file, commit convention, conventional-release workflow, architecture-decision-record process, issue templates, or formal code-review requirement. Introduce those deliberately rather than documenting them as current practice.
