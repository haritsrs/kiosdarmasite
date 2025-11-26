# Environment Variables Setup

This application requires environment variables to be configured before running. Follow these steps:

## 1. Create a `.env` file

Create a `.env` file in the root directory of the project with the following variables:

```env
# Firebase Configuration
# Get these from your Firebase project settings: https://console.firebase.google.com/
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Xendit Payment Gateway
# Get this from your Xendit dashboard: https://dashboard.xendit.co/
XENDIT_SECRET_KEY=xnd_development_your_secret_key

# Node Environment
NODE_ENV=development
```

## 2. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. If you haven't added a web app, click "Add app" and select the web icon (`</>`)
6. Copy the configuration values from the `firebaseConfig` object

The values you need:
- `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
- `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `databaseURL` → `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

## 3. Get Xendit Secret Key

1. Go to [Xendit Dashboard](https://dashboard.xendit.co/)
2. Navigate to Settings → API Keys
3. Copy your Secret Key (starts with `xnd_development_` for development or `xnd_production_` for production)

## 4. Enable Firebase Realtime Database

1. In Firebase Console, go to Realtime Database
2. Click "Create Database"
3. Choose a location (e.g., `asia-southeast1`)
4. Start in test mode (you can configure security rules later)
5. Copy the database URL to `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

## 5. Enable Firebase Authentication

1. In Firebase Console, go to Authentication
2. Click "Get Started"
3. Enable "Email/Password" sign-in method

## Quick Start (Skip Validation for Development)

If you want to run the app without setting up all environment variables immediately, you can skip validation:

```bash
SKIP_ENV_VALIDATION=true pnpm run dev
```

**Note:** This will allow the app to start, but features requiring Firebase or Xendit will not work until you configure the environment variables.

## Security Note

Never commit your `.env` file to version control. It's already in `.gitignore` for your protection.






