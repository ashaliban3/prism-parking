// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Capacitor } from "@capacitor/core";
// //import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref, get } from "firebase/database";
// import App from "./App";
// import "./index.css";
// import { auth, db } from "./firebaseClient";

// const rootEl = document.getElementById("root");
// if (!rootEl) throw new Error("#root not found");

// function withTimeout(promise, label, ms = 8000) {
//   return Promise.race([
//     promise,
//     new Promise((_, reject) =>
//       setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
//     ),
//   ]);
// }

// console.log("🚀 main.jsx started");
// console.log("window.Capacitor exists:", !!window.Capacitor);
// console.log("window.Capacitor.triggerEvent exists:", !!window.Capacitor?.triggerEvent);
// console.log("Capacitor platform:", Capacitor.getPlatform());

// console.log("🚀 main.jsx started");
// console.log("👤 auth.currentUser at startup:", auth.currentUser?.uid ?? null);
// console.log("📱 isNative:", Capacitor.isNativePlatform());
// console.log("📱 platform:", Capacitor.getPlatform());
// console.log("🌐 origin:", window.location.origin);
// console.log("🌐 href:", window.location.href);

// onAuthStateChanged(auth, async (user) => {
//   console.log("AUTH STATE CHANGED");
//   console.log("uid:", user?.uid ?? null);
//   console.log("isAnonymous:", user?.isAnonymous ?? null);

// onAuthStateChanged(auth, (user) => {
//   console.log("AUTH STATE CHANGED");
//   console.log("uid:", user?.uid ?? null);
//   console.log("isAnonymous:", user?.isAnonymous ?? null);

//   if (!user) {
//     console.log("🚪 No authenticated user");
//   } else {
//     console.log("🔐 Existing auth uid:", user.uid);
//   }
// });

//   // if (!user) {
//   //   console.log("⚠️ No user yet, attempting anonymous sign-in...");
//   //   try {
//   //     const cred = await withTimeout(
//   //       signInAnonymously(auth),
//   //       "signInAnonymously(auth)",
//   //       10000
//   //     );
//   //     console.log("✅ Signed in anonymously:", cred.user.uid);
//   //   } catch (e) {
//   //     console.error("❌ Anonymous sign-in failed:", e);
//   //   }
//   // } else {
//   //   console.log("🔐 Existing auth uid:", user.uid);
//   // }
// });

// setTimeout(() => {
//   console.log("⏱ delayed check window.Capacitor:", !!window.Capacitor);
//   console.log("⏱ delayed check triggerEvent:", !!window.Capacitor?.triggerEvent);
// }, 1000);

// ReactDOM.createRoot(rootEl).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// if (Capacitor.isNativePlatform() && "serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .getRegistrations()
//     .then((regs) => regs.forEach((reg) => reg.unregister()))
//     .catch((err) => console.error("❌ SW unregister failed:", err));
// }

// (async () => {
//   try {
//     console.log("🧪 about to get /lots");
//     const snap = await withTimeout(get(ref(db, "lots")), "get(/lots)", 10000);
//     console.log("🧪 direct get(/lots) exists:", snap.exists());
//     console.log("🧪 direct get(/lots) value:", snap.val());
//   } catch (err) {
//     console.error("❌ direct get(/lots) failed:", err);
//   }
// })();

// (async () => {
//   try {
//     console.log("🧪 about to REST fetch /lots.json");
//     const res = await withTimeout(
//       fetch("https://prism-dc193-default-rtdb.firebaseio.com/lots.json"),
//       "fetch(/lots.json)",
//       10000
//     );

//     console.log("🧪 REST /lots status:", res.status);

//     const data = await withTimeout(
//       res.json(),
//       "res.json() for /lots.json",
//       10000
//     );

//     console.log("🧪 REST /lots data:", data);
//   } catch (err) {
//     console.error("❌ REST /lots failed:", err);
//   }
// })();

import React from "react";
import ReactDOM from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import App from "./App";
import "./index.css";
import { auth, db } from "./firebaseClient";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("#root not found");

function withTimeout(promise, label, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

console.log("🚀 main.jsx started");
console.log("👤 auth.currentUser at startup:", auth.currentUser?.uid ?? null);
console.log("📱 isNative:", Capacitor.isNativePlatform());
console.log("📱 platform:", Capacitor.getPlatform());
console.log("🌐 origin:", window.location.origin);
console.log("🌐 href:", window.location.href);


onAuthStateChanged(auth, (user) => {
  console.log("AUTH STATE CHANGED");
  console.log("uid:", user?.uid ?? null);
  console.log("isAnonymous:", user?.isAnonymous ?? null);

  if (!user) {
    console.log("🚪 No authenticated user");
  } else {
    console.log("🔐 Existing auth uid:", user.uid);
  }
});

setTimeout(() => {
  console.log("⏱ delayed check window.Capacitor:", !!window.Capacitor);
  console.log("⏱ delayed check triggerEvent:", !!window.Capacitor?.triggerEvent);
}, 1000);

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (Capacitor.isNativePlatform() && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => regs.forEach((reg) => reg.unregister()))
    .catch((err) => console.error("❌ SW unregister failed:", err));
}

(async () => {
  try {
    console.log("🧪 about to get /lots");
    const snap = await withTimeout(get(ref(db, "lots")), "get(/lots)", 10000);
    console.log("🧪 direct get(/lots) exists:", snap.exists());
    console.log("🧪 direct get(/lots) value:", snap.val());
  } catch (err) {
    console.error("❌ direct get(/lots) failed:", err);
  }
})();

(async () => {
  try {
    console.log("🧪 about to REST fetch /lots.json");
    const res = await withTimeout(
      fetch("https://prism-dc193-default-rtdb.firebaseio.com/lots.json"),
      "fetch(/lots.json)",
      10000
    );

    console.log("🧪 REST /lots status:", res.status);

    const data = await withTimeout(
      res.json(),
      "res.json() for /lots.json",
      10000
    );

    console.log("🧪 REST /lots data:", data);
  } catch (err) {
    console.error("❌ REST /lots failed:", err);
  }
})();