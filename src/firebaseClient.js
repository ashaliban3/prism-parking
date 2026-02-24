import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// (Optional) Analytics only works in normal browsers, not reliably in Capacitor webview.
// We'll initialize analytics only on web later if you really want it.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-NF3QTB95DN",
};

// Prevent double-init during hot reload
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getDatabase(app);

// Auth (recommended even if you use anonymous)
export const auth = getAuth(app);



console.log("RTDB host:", db._repo?.repoInfo?.host);
console.log("Firebase projectId:", firebaseConfig.projectId);
