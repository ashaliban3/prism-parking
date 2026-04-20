import { Capacitor } from "@capacitor/core";
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
import { getFunctions } from "firebase/functions";

import {
  initializeAuth,
  getAuth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  inMemoryPersistence,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import {
  getDatabase,
  forceLongPolling,
  ref,
  update,
  // forceWebSockets,
} from "firebase/database";


const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ??
    "AIzaSyBR4gCjiWo1i_fqlgNv3LSsOOWg8EI1z7c",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ??
    "prism-dc193.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ??
    "https://prism-dc193-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "prism-dc193",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ??
    "prism-dc193.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "736992613237",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ??
    "1:736992613237:web:d4dd5a13b6cbd05690f93c",
  measurementId: "G-NF3QTB95DN",
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform();


export async function getWebMessaging() {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
}
/*
  For iOS/Capacitor debugging:
  - initializeAuth with inMemoryPersistence avoids browser persistence issues in WKWebView
  - forceLongPolling helps if RTDB transport is hanging in iOS WebView
*/
if (isNative && platform === "ios") {
  forceLongPolling();
  // If long polling still fails, comment that out and test:
  // forceWebSockets();
}

// export const auth = initializeAuth(app, {
//   persistence: inMemoryPersistence,
// });

export const auth = (() => {
  try {
    if (isNative && platform === "ios") {
      return initializeAuth(app, {
        persistence: inMemoryPersistence,
      });
    }

    return initializeAuth(app, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch (err) {
    return getAuth(app);
  }
})();

export const db = getDatabase(app);

window.testLotUpdate = async () => {
  try {
    console.log("setting LotA to 0...");
    await update(ref(db, "parkingLots/LotA"), {
      available: 0,
      name: "Lot A",
    });

    console.log("setting LotA to 25...");
    await update(ref(db, "parkingLots/LotA"), {
      available: 25,
      name: "Lot A",
    });

    console.log("✅ parking lot updated twice");
  } catch (err) {
    console.error("❌ testLotUpdate failed:", err);
  }
};

export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

export const microsoftProvider = new OAuthProvider("microsoft.com");
microsoftProvider.setCustomParameters({
  prompt: "select_account",
  tenant: "70de1992-07c6-480f-a318-a1afcba03983",
});

console.log("✅ Firebase projectId:", firebaseConfig.projectId);
console.log("✅ Firebase databaseURL:", firebaseConfig.databaseURL);
console.log("✅ API key present:", !!firebaseConfig.apiKey);
console.log("✅ RTDB host:", db?._repo?.repoInfo?.host);
console.log("Firebase authDomain:", firebaseConfig.authDomain);
console.log("App origin:", window.location.origin);
console.log("Full href:", window.location.href);
console.log("Is native platform:", isNative);
console.log("Platform:", platform);

console.log("VAPID:", import.meta.env.VITE_FIREBASE_VAPID_KEY);