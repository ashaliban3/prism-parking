import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "prism-dc193.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://prism-dc193-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "prism-dc193",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "prism-dc193.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
  measurementId: "G-NF3QTB95DN",
};

console.log("ENV databaseURL:", import.meta.env.VITE_FIREBASE_DATABASE_URL);

if (!firebaseConfig.databaseURL) {
  console.error("❌ Firebase databaseURL is missing. RTDB will not work.");
}

if (!firebaseConfig.projectId) {
  console.error("❌ Firebase projectId is missing.");
}

// Prevent double-init during hot reload
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);

console.log("✅ Firebase projectId:", firebaseConfig.projectId);
console.log("✅ Firebase databaseURL:", firebaseConfig.databaseURL);
console.log("projectId", firebaseConfig.projectId);
console.log("dbURL", firebaseConfig.databaseURL);
console.log("✅ RTDB host:", db?._repo?.repoInfo?.host);

onAuthStateChanged(auth, (u) => {
  console.log("auth uid", u?.uid ?? null);
});
