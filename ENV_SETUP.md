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

## 3. Enable Firebase Realtime Database

1. In Firebase Console, go to Realtime Database
2. Click "Create Database"
3. Choose a location (e.g., `asia-southeast1`)
4. Start in test mode (you can configure security rules later)
5. Copy the database URL to `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

## 4. Enable Firebase Authentication

1. In Firebase Console, go to Authentication
2. Click "Get Started"
3. Enable "Email/Password" sign-in method

## Quick Start (Skip Validation for Development)

If you want to run the app without setting up all environment variables immediately, you can skip validation:

```bash
SKIP_ENV_VALIDATION=true pnpm run dev
```

**Note:** This will allow the app to start, but features requiring Firebase will not work until you configure the environment variables.

## Security Notes

### Environment Variable Security

- **Never commit your `.env` file to version control.** It's already in `.gitignore` for your protection.
- **Use `.env.example` as a template** - Copy it to `.env.local` and fill in your actual values.
- **Rotate secrets regularly** - Change API keys and secrets every 90 days or after any security incident.
- **Use different keys for development and production** - Never use production keys in development.
- **Keep server-side secrets secure** - `RESEND_API_KEY` and Firebase Admin credentials are highly sensitive.
- **Client-side Firebase config is safe** - `NEXT_PUBLIC_*` variables are exposed to the browser, which is expected for Firebase client SDK.

### Secret Rotation Checklist

- [ ] Resend API keys (every 90 days)
- [ ] Firebase Admin private keys (if compromised)
- [ ] Review and audit environment variables quarterly

### Production Deployment

When deploying to production (Vercel, etc.):

1. Set all environment variables in your hosting platform's dashboard
2. Never hardcode secrets in code
3. Use environment-specific values (different Firebase project for production)
4. Enable secret scanning in your CI/CD pipeline
5. Monitor for exposed secrets in logs and error tracking






