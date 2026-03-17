// alert("main.jsx ran");
// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "./index.css";
// import { Capacitor } from "@capacitor/core";
// import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebaseClient";

// console.log("✅ main.jsx loaded");

// onAuthStateChanged(auth, async (user) => {
//   if (!user) {
//     try {
//       await signInAnonymously(auth);
//       console.log("✅ Signed in anonymously");
//     } catch (e) {
//       console.error("❌ Anonymous sign-in failed:", e);
//     }
//   } else {
//     console.log("🔐 Auth uid:", user.uid);
//   }
// });

// console.log("Maps key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
// console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.slice(0,6));


// const isNative = Capacitor.isNativePlatform();

// if (isNative && "serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .getRegistrations()
//     .then((regs) => regs.forEach((reg) => reg.unregister()))
//     .catch(() => {});
// }

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Capacitor } from "@capacitor/core";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseClient";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("#root not found");

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// After render: auth setup (won’t block UI)
try {
  if (!auth) throw new Error("auth is undefined (firebaseClient export/init issue)");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      try {
        await signInAnonymously(auth);
        console.log("✅ Signed in anonymously");
      } catch (e) {
        console.error("❌ Anonymous sign-in failed:", e);
      }
    } else {
      console.log("🔐 Auth uid:", user.uid);
    }
  });
} catch (e) {
  console.error("❌ Firebase init/auth listener crashed:", e);
}