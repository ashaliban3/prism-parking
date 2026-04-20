import { getToken, onMessage } from "firebase/messaging";
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

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const messaging = await getWebMessaging();
  if (!messaging) {
    throw new Error("Firebase Messaging is not supported in this browser/environment.");
  }

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error("No FCM token was returned.");
  }

  const saveToken = httpsCallable(functions, "registerPushToken");

await saveToken({
  token,
  platform: "web",
});

onMessage(messaging, (payload) => {
  console.log(payload);
  new Notification(payload.notification.title, {
    body: payload.notification.body,
  });
});

  const userId = auth.currentUser?.uid || "anonymous";

  await set(ref(db, `fcmTokens/${userId}`), {
    token,
    updatedAt: new Date().toISOString(),
    platform: "web",
  });

  return token;
}

export async function listenForForegroundMessages(onPayload) {
  const messaging = await getWebMessaging();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    console.log("Foreground push received:", payload);
    if (typeof onPayload === "function") {
      onPayload(payload);
    }
  });
}

// export async function subscribeTokenToLot(lotID) {
//   const messaging = await getWebMessaging();
//   if (!messaging) throw new Error("Messaging not supported");

//   const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

//   const token = await getToken(messaging, {
//     vapidKey: VAPID_KEY,
//     serviceWorkerRegistration: registration,
//   });

//   if (!token) throw new Error("No token available");

//   const response = await fetch(
//     "https://us-central1-prism-dc193.cloudfunctions.net/subscribeToLotTopic",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userId: auth.currentUser?.uid,
//         lotID,
//       }),
//     }
//   );

//   if (!response.ok) {
//     const text = await response.text();
//     throw new Error(text || "Failed to subscribe to lot topic.");
//   }

//   return response.json();
// }
// import { getToken, onMessage } from "firebase/messaging";
// import { ref, set } from "firebase/database";
// import { getWebMessaging, db } from "./firebaseClient";

// const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// export async function enablePushNotifications(userId) {
//   if (!("Notification" in window)) {
//     throw new Error("Notifications not supported");
//   }

//   const permission = await Notification.requestPermission();
//   if (permission !== "granted") {
//     throw new Error("Permission denied");
//   }

//   const messaging = await getWebMessaging();
//   if (!messaging) throw new Error("Messaging not supported");

//   const registration = await navigator.serviceWorker.register(
//     "/firebase-messaging-sw.js"
//   );

//   const token = await getToken(messaging, {
//     vapidKey: VAPID_KEY,
//     serviceWorkerRegistration: registration,
//   });

//   if (!token) throw new Error("No token");

//   console.log("🔥 FCM TOKEN:", token);

//   // ✅ save token in Firebase (not fake API route)
//   await set(ref(db, `fcmTokens/${userId}`), {
//     token,
//     createdAt: new Date().toISOString(),
//   });

//   return token;
// }

// // 👇 subscribe to a specific lot topic
// export async function subscribeToLot(lotID) {
//   await fetch(
//     `https://iid.googleapis.com/iid/v1/${await getStoredToken()}/rel/topics/lot_${lotID}`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: "key=YOUR_SERVER_KEY",
//       },
//     }
//   );
// }

// // helper
// async function getStoredToken() {
//   const messaging = await getWebMessaging();
//   return getToken(messaging, {
//     vapidKey: VAPID_KEY,
//   });
// }

// export async function listenForForegroundMessages() {
//   const messaging = await getWebMessaging();
//   if (!messaging) return;

//   onMessage(messaging, (payload) => {
//     console.log("📩 Foreground:", payload);

//     alert(`${payload.notification?.title}\n${payload.notification?.body}`);
//   });
// }