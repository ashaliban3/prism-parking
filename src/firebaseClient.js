import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// (Optional) Analytics only works in normal browsers, not reliably in Capacitor webview.
// We'll initialize analytics only on web later if you really want it.

const firebaseConfig = {
  apiKey: "AIzaSyBR4gCjiWo1i_fqlgNv3LSsOOWg8EI1z7c",
  authDomain: "prism-dc193.firebaseapp.com",
  databaseURL: "https://prism-dc193-default-rtdb.firebaseio.com",
  projectId: "prism-dc193",
  storageBucket: "prism-dc193.firebasestorage.app",
  messagingSenderId: "736992613237",
  appId: "1:736992613237:web:d4dd5a13b6cbd05690f93c",
  measurementId: "G-NF3QTB95DN",
};

// Prevent double-init during hot reload
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getDatabase(app);

// Auth (recommended even if you use anonymous)
export const auth = getAuth(app);



console.log("RTDB host:", db._repo?.repoInfo?.host);
console.log("Firebase projectId:", firebaseConfig.projectId);
