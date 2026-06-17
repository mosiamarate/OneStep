# OneStep 🌿

OneStep is a calm productivity and focus web app designed to help students and young professionals slow down, check in with their emotions, and focus on one task at a time.

The app is built around a simple flow:

```txt
Landing Page
   ↓
Login / Signup
   ↓
Dashboard
   ↓
Mood Check-In
   ↓
One Task
   ↓
Focus Timer
```

---

## Purpose

OneStep exists to help students and young professionals slow down, relax, and focus on one task at a time.

Instead of overwhelming users with long task lists, streak pressure, or aggressive productivity tracking, OneStep encourages gentle progress through emotional awareness and focused work sessions.

---

## Features

* User authentication with Firebase
* Email and password login/signup
* Google authentication
* Protected app routes
* Personalized dashboard
* Mood check-in before starting work
* Optional emotional reflection note
* One-task focus system
* Preset and custom focus timer options
* Focus session countdown
* Pause, resume, reset, and end session controls
* Firestore task and session saving
* Calm dark UI design
* Responsive layout for desktop and mobile

---

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Firebase Authentication
* Firebase Firestore
* Vercel-ready deployment

---

Project Structure
```txt
onestep/
├── public/
│
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── focus/
│   │   │   └── page.tsx
│   │   │
│   │   ├── mood/
│   │   │   └── page.tsx
│   │   │
│   │   ├── profile/
│   │   │
│   │   ├── settings/
│   │   │
│   │   ├── task/
│   │   │   └── page.tsx
│   │   │
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.css
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthCard.tsx
│   │   │   ├── AuthFooter.tsx
│   │   │   ├── AuthHeader.tsx
│   │   │   ├── AuthInput.tsx
│   │   │   ├── GoogleButton.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── focus/
│   │   │   └── FocusClient.tsx
│   │   │
│   │   ├── layout/
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── mood/
│   │   │   └── MoodCard.tsx
│   │   │
│   │   ├── task/
│   │   │   └── TimeSelector.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   │
│   ├── constants/
│   │   └── moods.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTimer.ts
│   │   └── useUserProfile.ts
│   │
│   └── lib/
│       ├── auth.ts
│       └── firebase.ts
│
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```
Notes
src/app/page.tsx is the landing page.
src/app/auth/login/page.tsx is the login page.
src/app/auth/signup/page.tsx is the signup page.
src/app/auth/forgot-password/page.tsx is the password reset page.
src/app/dashboard/page.tsx is the user home page after login.
src/app/mood/page.tsx handles emotional check-ins.
src/app/task/page.tsx handles task creation and timer selection.
src/app/focus/page.tsx loads the focus session page.
src/components/focus/FocusClient.tsx contains the main focus timer logic.
src/lib/firebase.ts handles Firebase initialization.
src/lib/auth.ts contains authentication helper functions.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/onestep.git
cd onestep
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Add your Firebase project values from:

```txt
Firebase Console → Project Settings → General → Your apps
```

### 4. Run the development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Firebase Setup

Enable the following Firebase services:

### Authentication

Enable:

* Email/Password
* Google

Also make sure `localhost` is added under:

```txt
Authentication → Settings → Authorized domains
```

### Firestore Database

The app uses Firestore collections such as:

```txt
users
moods
tasks
focusSessions
```

---

## Firestore Security Rules

Use Firestore rules that only allow authenticated users to access their own data.

Example:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }

    match /moods/{moodId} {
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;

      allow read, update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }

    match /tasks/{taskId} {
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;

      allow read, update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }

    match /focusSessions/{sessionId} {
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;

      allow read, update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## Environment Safety

Do not commit `.env.local` to GitHub.

Make sure `.gitignore` includes:

```gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
node_modules
.next
```

The Firebase web config is used on the client side, but database protection should always be handled through Firebase Security Rules.

---

## Available Scripts

```bash
npm run dev
```

Runs the app locally.

```bash
npm run build
```

Builds the app for production.

```bash
npm run start
```

Runs the production build.

```bash
npm run lint
```

Checks code quality.

---

## Current App Flow

```txt
/
   ↓
/auth/signup or /auth/login
   ↓
/dashboard
   ↓
/mood
   ↓
/task
   ↓
/focus
   ↓
/dashboard
```

---

## Future Improvements

* Real dashboard analytics
* Mood history
* Focus history
* User profile editing
* Preferred timer settings
* Daily focus goal
* PWA support
* Offline mode
* Push reminders
* Light mode option

---

## Author

Built by Mosia Marate.

---

## License

This project is for learning and personal development.
