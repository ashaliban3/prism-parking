
import { getToken } from "firebase/messaging";
import { ref, set } from "firebase/database";
import { httpsCallable } from "firebase/functions";

import { auth, db, functions, getWebMessaging } from "../firebaseClient";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export async function registerForPushNotifications() {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications.");
  }

  if (!("serviceWorker" in navigator)) {
    throw new Error("This browser does not support service workers.");
  }

  if (!VAPID_KEY) {
    throw new Error("Missing VITE_FIREBASE_VAPID_KEY in .env");
  }

  // Request permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  // Get messaging instance
  const messaging = await getWebMessaging();
  if (!messaging) {
    throw new Error("Firebase Messaging is not supported in this environment.");
  }

  // Register service worker
  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );

  await navigator.serviceWorker.ready;

  console.log("Service worker ready:", registration.active);

  // Get FCM token
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error("No FCM token was returned.");
  }

  console.log("🔥 FCM TOKEN:", token);

  // Save token via Cloud Function (recommended)
  const saveToken = httpsCallable(functions, "registerPushToken");

  await saveToken({
    token,
    platform: "web",
  });

  // Also store in RTDB (optional backup)
  const userId = auth.currentUser?.uid || "anonymous";

  await set(ref(db, `fcmTokens/${userId}`), {
    token,
    updatedAt: new Date().toISOString(),
    platform: "web",
  });

  return token;
}
// import { getToken, onMessage } from "firebase/messaging";
// import { ref, set } from "firebase/database";
// import { httpsCallable } from "firebase/functions";
// import { auth, db, functions, getWebMessaging } from "../firebaseClient";
// const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// export async function registerForPushNotifications() {
//   if (!("Notification" in window)) {
//     throw new Error("This browser does not support notifications.");
//   }

//   if (!("serviceWorker" in navigator)) {
//     throw new Error("This browser does not support service workers.");
//   }

//   if (!VAPID_KEY) {
//     throw new Error("Missing VITE_FIREBASE_VAPID_KEY in .env");
//   }

//   const permission = await Notification.requestPermission();
//   if (permission !== "granted") {
//     throw new Error("Notification permission was not granted.");
//   }

//   const messaging = await getWebMessaging();
//   if (!messaging) {
//     throw new Error("Firebase Messaging is not supported in this browser/environment.");
//   }

//   const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

//   await navigator.serviceWorker.ready;

//   console.log("Service worker ready:", registration.active);

//   const token = await getToken(messaging, {
//     vapidKey: VAPID_KEY,
//     serviceWorkerRegistration: registration,
//   });

//   if (!token) {
//     throw new Error("No FCM token was returned.");
//   }

//   const saveToken = httpsCallable(functions, "registerPushToken");

// await saveToken({
//   token,
//   platform: "web",
// });

// onMessage(messaging, (payload) => {
//   console.log(payload);
//   new Notification(payload.notification.title, {
//     body: payload.notification.body,
//   });
// });

//   const userId = auth.currentUser?.uid || "anonymous";

//   await set(ref(db, `fcmTokens/${userId}`), {
//     token,
//     updatedAt: new Date().toISOString(),
//     platform: "web",
//   });

//   return token;
// }

// export async function listenForForegroundMessages(onPayload) {
//   const messaging = await getWebMessaging();
//   if (!messaging) return () => {};

//   return onMessage(messaging, (payload) => {
//     console.log("Foreground push received:", payload);
//     if (typeof onPayload === "function") {
//       onPayload(payload);
//     }
//   });
// }
