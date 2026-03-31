/* public/firebase-messaging-sw.js */
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
});

const messaging = firebase.messaging();

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const lotId = event.notification?.data?.lotId;
  const url = lotId ? `/map?lot=${lotId}` : "/map";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.notification?.title || "Parking lot full";

  const notificationOptions = {
    body: payload.notification?.body || "A parking lot just reached capacity.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: payload.data || {},
    tag: payload.data?.tag || "lot-full",
    renotify: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});