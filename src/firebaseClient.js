import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// (Optional) Analytics only works in normal browsers, not reliably in Capacitor webview.
// We'll initialize analytics only on web later if you really want it.

const firebaseConfig = {
  apiKey: "AIzaSyD-o88J5uXFzorGhQSArBRxxhwmNEBQP1s",
  authDomain: "prism-dev-8c6f5.firebaseapp.com",
  databaseURL: "https://prism-dev-8c6f5-default-rtdb.firebaseio.com",
  projectId: "prism-dev-8c6f5",
  storageBucket: "prism-dev-8c6f5.firebasestorage.app",
  messagingSenderId: "38608344624",
  appId: "1:38608344624:web:97b5f8dc6cce8743407ff5",
  measurementId: "G-XK7EQFQC6Z",
};

// Prevent double-init during hot reload
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Realtime Database handle (THIS is what you’ll use everywhere)
export const rtdb = getDatabase(app);

// Auth (recommended even if you use anonymous)
export const auth = getAuth(app);