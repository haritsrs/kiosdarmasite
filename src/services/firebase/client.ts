import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";

let appInstance: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let databaseInstance: Database | undefined;
let storageInstance: FirebaseStorage | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (appInstance) {
    return appInstance;
  }

  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    throw new Error("Firebase environment variables are not set. Check NEXT_PUBLIC_FIREBASE_* keys.");
  }

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  appInstance = getApps().length ? getApps()[0]! : initializeApp(config);
  return appInstance;
}

export function getFirebaseAuth(): Auth {
  if (authInstance) {
    return authInstance;
  }
  authInstance = getAuth(getFirebaseApp());
  return authInstance;
}

export function getRealtimeDatabase(): Database {
  if (databaseInstance) {
    return databaseInstance;
  }
  databaseInstance = getDatabase(getFirebaseApp());
  return databaseInstance;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (storageInstance) {
    return storageInstance;
  }
  storageInstance = getStorage(getFirebaseApp());
  return storageInstance;
}


