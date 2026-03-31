// notifications.js
import { getToken, onMessage } from "firebase/messaging";
import { getWebMessaging } from "./firebaseClient";

const VAPID_KEY = "YOUR_PUBLIC_VAPID_KEY";

export async function enablePushNotifications(userId) {
  if (!("Notification" in window)) {
    throw new Error("Notifications are not supported in this browser.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const messaging = await getWebMessaging();
  if (!messaging) {
    throw new Error("Firebase Messaging is not supported on this device/browser.");
  }

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error("No FCM registration token returned.");
  }

  // Save token to your backend or database
  await fetch("/api/save-fcm-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, token }),
  });

  return token;
}

export async function listenForForegroundMessages() {
  const messaging = await getWebMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground push received:", payload);
    // optional: show in-app toast
  });
}