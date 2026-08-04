# OneStep Authentication Email System

## Architecture

OneStep keeps Firebase Authentication as the identity and session provider. Email/password signup, login, Google OAuth, and password updates still use Firebase Auth. Resend is used only for transactional email delivery.

Next.js API routes run server-side and use Firebase Admin SDK to:

- verify Firebase ID tokens for authenticated verification requests
- create hashed OTP records in Firestore
- mark email/password accounts verified after a valid OTP
- update Firebase Auth passwords after password reset OTP verification

Client components never import Firebase Admin or read Resend secrets.

## Environment Variables

Server-only variables:

```env
RESEND_API_KEY=
EMAIL_FROM=OneStep <noreply@onestepapp.co.za>
SUPPORT_EMAIL=support@onestepapp.co.za
OTP_SECRET=
FIREBASE_SERVICE_ACCOUNT_KEY=
```

Alternative Firebase Admin variables:

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Public variables:

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Do not prefix `RESEND_API_KEY`, `EMAIL_FROM`, `OTP_SECRET`, or Firebase Admin credentials with `NEXT_PUBLIC_`.

## Email Templates

Templates live in `src/emails` and use React Email components with OneStep branding:

- deep navy background: `#0F172A`
- slate card: `#1E293B`
- blue accent: `#3B82F6`
- white primary text: `#FFFFFF`
- slate secondary text: `#CBD5E1`

Current templates:

- `VerifyEmail.tsx`
- `PasswordReset.tsx`
- `WelcomeEmail.tsx`
- `SecurityAlert.tsx`

## OTP Security

OTP utilities live in `src/lib/otp.ts`.

Rules:

- 6 digit numeric OTP
- 10 minute expiry
- maximum 5 attempts
- raw OTP is never stored
- OTP hash includes user id, purpose, code, and `OTP_SECRET`
- resend requests have a 60 second cooldown

Firestore collection: `emailOtps`

```ts
{
  uid: string;
  email: string;
  otpHash: string;
  purpose:
    | "EMAIL_VERIFICATION"
    | "PASSWORD_RESET"
    | "LOGIN_VERIFICATION"
    | "CHANGE_EMAIL";
  attempts: number;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  used: boolean;
}
```

## Signup Verification Flow

1. User creates an email/password account with Firebase Auth.
2. Firestore user profile is created with `emailOtpVerified: false`.
3. Client calls `/api/auth/send-verification` with the Firebase ID token.
4. API stores a hashed OTP and sends a Resend verification email.
5. User is redirected to `/auth/verify-email`.
6. User submits the OTP to `/api/auth/verify-email`.
7. API marks Firebase Auth `emailVerified: true` and Firestore `emailOtpVerified: true`.
8. A welcome email is sent.
9. The app auth cookie is updated and the user can access protected pages.

Google users are treated as verified and keep the existing Google sign-in behavior.

## Password Reset Flow

1. User submits an email on `/auth/forgot-password`.
2. Client calls `/api/auth/forgot-password`.
3. API looks up the Firebase user, stores a hashed password reset OTP, and sends a Resend password reset email.
4. User enters email, OTP, and new password on `/auth/reset-password`.
5. Client calls `/api/auth/reset-password`.
6. API validates the OTP and updates the Firebase Auth password.

The API returns the same success response for unknown emails to avoid account enumeration.

## Route Protection

`src/proxy.ts` protects app routes using auth cookies:

- unauthenticated users go to `/auth/login`
- authenticated but unverified email/password users go to `/auth/verify-email`
- verified users cannot revisit auth pages

The client `ProtectedRoute` remains the Firebase-backed guard after the page loads.

## Deployment Checklist

- Configure Resend domain and set `EMAIL_FROM` to a verified sender.
- Set `RESEND_API_KEY` and `OTP_SECRET` in Vercel server environment variables.
- Add Firebase Admin credentials as `FIREBASE_SERVICE_ACCOUNT_KEY` or the split Firebase Admin variables.
- Keep all secrets server-only.
- Confirm Firestore security rules allow client reads/writes required by existing app data, while OTP writes happen through Admin SDK.
- Run `npm run build` before deployment.
