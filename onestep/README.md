# OneStep

OneStep is a productivity and focus web application designed to help students and professionals work with greater clarity and intention. Instead of overwhelming users with long task lists or encouraging productivity streaks, OneStep promotes a calmer approach by guiding users to focus on one meaningful task at a time.

The application combines mood check-ins, focused work sessions, and personal progress tracking to help users build sustainable productivity habits while maintaining awareness of their mental well-being.

---

## Overview

OneStep provides a simple workflow that helps users:

- Create and securely manage an account
- Verify their email before accessing the application
- Track their mood before and after focus sessions
- Create and manage one priority task
- Complete distraction-free focus sessions
- Review previous focus sessions and activity
- Monitor productivity through a personalized dashboard

The application is built as a Progressive Web App (PWA), allowing it to be installed and used across desktop and mobile devices.

---

## Features

### Authentication

- Secure email and password authentication
- Google Sign-In
- Email verification using One-Time Passwords (OTP)
- Password reset using secure OTP verification
- Protected routes for authenticated users
- Secure session handling
- Branded transactional emails powered by Resend

### Dashboard

- Personalized welcome experience
- Overview of recent productivity
- Current focus information
- Recent mood summary
- Quick access to core features

### Mood Tracking

- Mood check-ins before and after focus sessions
- Optional reflection notes
- Secure storage of mood history

### Task Management

- Single-task productivity workflow
- Task creation and management
- Custom focus duration selection
- Timer presets

### Focus Sessions

- Countdown timer
- Pause and resume controls
- Reset functionality
- Custom session durations
- Automatic session history

### History

- Review previous focus sessions
- View completed work
- Monitor personal productivity over time

### Progressive Web App

- Installable on supported devices
- Responsive design for desktop and mobile
- Optimized for full-screen experience
- Foundation for offline support

---

## Technology Stack

### Frontend

- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS

### Backend

- Firebase Authentication
- Firestore Database
- Firebase Admin SDK
- Next.js API Routes

### Email

- Resend
- React Email

### Deployment

- Vercel

---

## Application Routes

| Route | Description |
| -------- | ------------- |
| `/` | Landing page |
| `/auth/login` | User login |
| `/auth/signup` | Create account |
| `/auth/verify-email` | Email verification |
| `/auth/forgot-password` | Request password reset |
| `/auth/reset-password` | Reset password |
| `/dashboard` | User dashboard |
| `/mood` | Mood check-in |
| `/task` | Task management |
| `/focus` | Focus session |
| `/history` | Focus history |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

---

## Application Flow

```text
Landing Page
      │
      ▼
Create Account / Login
      │
      ▼
Email Verification
      │
      ▼
Dashboard
      │
      ▼
Mood Check-in
      │
      ▼
Create Task
      │
      ▼
Focus Session
      │
      ▼
Post-Session Mood Reflection
      │
      ▼
Dashboard & History
```

---

## Security

OneStep follows modern authentication and security practices, including:

- Firebase Authentication
- Secure email verification with OTP
- OTP-based password reset
- Protected application routes
- Server-side authentication checks
- Firebase Admin SDK for privileged operations
- Firestore Security Rules
- Environment-based secret management
- Transactional email delivery using Resend

---

## Roadmap

Planned enhancements include:

- Floating mini focus timer
- Weekly productivity insights
- Recovery Mode
- Achievement system
- Calendar integration
- Push notifications
- Advanced analytics
- Admin dashboard
- Additional security hardening

---

## Author

Built by Mosia Marate.

Computer Networking Graduate and Software Developer passionate about building secure, user-focused productivity applications.

---

## License

This project is intended for portfolio, educational, and personal development purposes.

---
