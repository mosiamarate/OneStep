# OneStep User Account Management System

## Overview

The User Account Management system enables authenticated users to manage their personal profile, download a GDPR-style data export of their personal data, and securely delete their account and associated data.

All user data operations strictly enforce client isolation. Server-side API endpoints never trust client-provided user IDs and rely exclusively on verified Firebase ID Tokens.

---

## System Architecture

```text
               Client Browser (Settings UI)
               ├── /settings/profile
               ├── /settings/account
               └── /settings/data
                       │
       Bearer Authorization Header (Firebase ID Token)
                       │
                       ▼
            Next.js Server API Routes
      ┌────────────────────┬────────────────────┐
      │                    │                    │
      ▼                    ▼                    ▼
POST /api/account/delete  GET /api/account/export  Middleware (proxy.ts)
      │                    │                    │
      └─────────┬──────────┘                    │
                │ Verifies ID Token              │ Enforces Route Auth
                ▼                               ▼
       Firebase Admin Auth & Firestore Database
```

---

## 1. User Profile Management (`/settings/profile`)

- **Route**: `/settings/profile`
- **Features**:
  - Displays user profile information: Display Name, Email address, Account Creation Date, Profile photo / avatar, and User ID (UID).
  - Form field allows users to edit their Display Name.
  - Form submission updates both:
    1. Firebase Authentication User Profile (`updateProfile(auth.currentUser, { displayName })`)
    2. Firestore `users/{uid}` document (`{ displayName, fullName, updatedAt: serverTimestamp() }`).
  - Read-only fields: User UID and Email address cannot be modified directly from Firestore.

### Firestore User Document Model (`users/{uid}`)

```ts
{
  uid: string;
  email: string;
  displayName: string;
  fullName?: string;
  photoURL?: string;
  provider?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 2. Secure Account Deletion (`/settings/account`)

- **Route**: `/settings/account`
- **Features**:
  - Danger Zone card styling highlighting destructive actions.
  - "Delete my account" button opens an interactive confirmation modal.
  - Confirmation Modal requires the user to type the exact phrase `DELETE MY ACCOUNT` before enabling the deletion button.
  - Submits request to `POST /api/account/delete` with `Authorization: Bearer <ID_TOKEN>`.
  - On completion, clears local session cookie (`logoutUser()`) and redirects to `/auth/login`.

### API Endpoint: `POST /api/account/delete`

- **Authentication**: Required (`Authorization: Bearer <ID_TOKEN>`)
- **Server Verification Flow**:
  1. Extracts Bearer token from header.
  2. Verifies token with `adminAuth.verifyIdToken(token)`.
  3. Obtains verified `uid = decodedToken.uid`.
  4. Purges all Firestore documents owned by the user:
     - `users/{uid}`
     - `tasks` where `userId == uid`
     - `moods` where `userId == uid`
     - `focusSessions` where `userId == uid`
     - `emailOtps` documents associated with `uid`
  5. Deletes the Firebase Auth account using `adminAuth.deleteUser(uid)`.
  6. Returns `200 OK` response.

---

## 3. GDPR Data Export (`/settings/data`)

- **Route**: `/settings/data`
- **Features**:
  - "Export My Data" button allows users to download a JSON file containing all personal data associated with their account.
  - Calls `GET /api/account/export` with `Authorization: Bearer <ID_TOKEN>`.
  - Generates blob download named `onestep-data-export-${uid}.json`.

### API Endpoint: `GET /api/account/export`

- **Authentication**: Required (`Authorization: Bearer <ID_TOKEN>`)
- **Payload Structure**:

```json
{
  "exportedAt": "2026-08-08T12:00:00.000Z",
  "user": {
    "uid": "USER_UID",
    "displayName": "Jane Doe",
    "email": "jane@example.com",
    "photoURL": "",
    "provider": "password",
    "createdAt": "2026-08-01T10:00:00.000Z",
    "updatedAt": "2026-08-08T12:00:00.000Z"
  },
  "tasks": [
    {
      "id": "TASK_ID",
      "title": "Complete project setup",
      "status": "completed",
      "createdAt": "2026-08-08T10:00:00.000Z"
    }
  ],
  "moods": [
    {
      "id": "MOOD_ID",
      "mood": "calm",
      "moodLabel": "Calm",
      "phase": "before_focus",
      "createdAt": "2026-08-08T10:05:00.000Z"
    }
  ],
  "focusSessions": [
    {
      "id": "SESSION_ID",
      "durationMinutes": 25,
      "completed": true,
      "completedAt": "2026-08-08T10:30:00.000Z"
    }
  ]
}
```

---

## 4. Security Implementation Highlights

1. **Zero Client-Side Trust**: Client-provided UIDs in body parameters or URL parameters are strictly ignored. All backend actions derive the targeted user from `adminAuth.verifyIdToken(token)`.
2. **Privileged SDK Operations**: Firestore data purging and Firebase Auth account deletion are executed exclusively on the server using `firebase-admin`.
3. **Route Protection**: The `src/proxy.ts` middleware guards all `/settings/*` routes, redirecting unauthenticated or unverified requests to `/auth/login` or `/auth/verify-email`.
4. **Session Expiry**: Sessions use a Firebase Admin session cookie that is `HttpOnly`, `SameSite=Lax`, secure in production, and expires after 24 hours. The proxy verifies the cookie server-side and clears invalid or revoked sessions.
5. **Rate Limiting**: Auth and sensitive account APIs use action-scoped server-side rate limiting to protect OTP verification, password reset, verification email, export, and deletion requests. Multi-instance production deployments should use a shared rate-limit store or hosting-provider control.
6. **Confirmation Safeguard**: Deletion requires typing `DELETE MY ACCOUNT` in a modal dialog before sending the request.
7. **Standard HTTP Error Responses**:
   - `401 Unauthorized`: Missing or invalid Firebase ID token.
   - `403 Forbidden`: Token invalid or missing UID claim.
   - `500 Internal Server Error`: Server processing failure.
