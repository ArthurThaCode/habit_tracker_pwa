# Habit Tracker PWA

A mobile-first Habit Tracker Progressive Web App (PWA) built with Next.js, React, TypeScript, and Tailwind CSS. This application allows users to sign up, log in, manage daily habits, track completions, and view their streaks. It features offline capabilities through a Service Worker and persists all data locally.

## Project Overview

This project was built to fulfill the technical requirements of the Stage 3 Frontend execution task. It is a fully functional web application that focuses on deterministic behavior, correct technical implementation of utility functions, strict UI/UX constraints, and comprehensive test coverage.

## Setup Instructions

1. **Clone the repository** (if applicable) or navigate to the project directory.
2. **Install dependencies**:
   ```bash
   npm install
   ```

## Run Instructions

To start the development server:
```bash
npm run dev
```
Then navigate to `http://localhost:3000` in your browser.

To build for production:
```bash
npm run build
npm run start
```

## Test Instructions

The project uses Vitest for unit and integration testing, and Playwright for end-to-end (E2E) testing.

- **Run unit tests (with coverage)**:
  ```bash
  npm run test:unit
  ```
- **Run integration tests**:
  ```bash
  npm run test:integration
  ```
- **Run end-to-end tests**:
  ```bash
  npm run test:e2e
  ```
- **Run all tests**:
  ```bash
  npm run test
  ```

## Local Persistence Structure

The application uses `localStorage` for all data persistence. This ensures the app works entirely client-side without needing a remote database. The storage structure uses three main keys:

1. `habit-tracker-users`: Stores a JSON array of registered users (`{ id, email, password, createdAt }`).
2. `habit-tracker-session`: Stores the active session object (`{ userId, email }`) or `null` if unauthenticated.
3. `habit-tracker-habits`: Stores a JSON array of all habits created by all users (`{ id, userId, name, description, frequency, createdAt, completions }`).

When a user logs in, the app filters the `habit-tracker-habits` array to only show habits where `userId` matches the current session.

## PWA Implementation

The app is implemented as a Progressive Web App to support installability and basic offline caching:

- **Manifest**: Located at `public/manifest.json`. It defines the app's name, theme colors, display mode (`standalone`), and paths to the generated 192x192 and 512x512 icons.
- **Service Worker**: Located at `public/sw.js`. It is registered client-side via the `PwaRegistration` component (`src/components/shared/PwaRegistration.tsx`).
- **Caching Strategy**: The Service Worker implements a "Cache-First" strategy for the app shell (`/`, `/login`, `/signup`, `/dashboard`, and assets). It caches these paths on installation. During a fetch event, it attempts to serve from the cache first; if the network fails (offline), it falls back to the cached `/` route to prevent a hard crash.

## Trade-offs and Limitations

- **Local Storage Limitations**: Because data is tied to the browser's `localStorage`, users cannot access their habits across different devices or browsers. If they clear their browser data, their habits and accounts will be lost.
- **Security**: Passwords are saved in plain text within `localStorage`. This is intentional for the scope of this client-side-only task, but in a real-world application, passwords must be securely hashed and authentication handled by a backend service.
- **Synchronous Storage**: `localStorage` is synchronous and blocks the main thread. While fine for a small amount of data, a larger production application would benefit from asynchronous storage like IndexedDB.

## Test Mapping

The test suite strictly verifies the behaviors required by the technical document.

### Unit Tests
- `tests/unit/slug.test.ts`: Verifies `getHabitSlug` correctly formats strings into lowercase, hyphenated slugs while removing invalid characters.
- `tests/unit/validators.test.ts`: Verifies `validateHabitName` correctly rejects empty strings and long strings, while trimming valid names.
- `tests/unit/streaks.test.ts`: Verifies `calculateCurrentStreak` accurately calculates consecutive backward calendar days of completion.
- `tests/unit/habits.test.ts`: Verifies `toggleHabitCompletion` accurately toggles dates without mutation or duplication.

### Integration Tests
- `tests/integration/auth-flow.test.tsx`: Verifies the React component behavior for the signup and login forms, including validation messages and session creation/redirection.
- `tests/integration/habit-form.test.tsx`: Verifies the React component behavior for creating, editing, and deleting habits (with confirmation), as well as toggling completions.

### End-to-End Tests
- `tests/e2e/app.spec.ts`: Verifies the full user journey in a real browser environment, including:
  - Splash screen routing and authentication guards.
  - Complete signup/login flows leading to the dashboard.
  - Habit creation and streak updates in the DOM.
  - State persistence across page reloads.
  - Offline app shell loading (intercepting the network).
"# habit_tracker_pwa" 
