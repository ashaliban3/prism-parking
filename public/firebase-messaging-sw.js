importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey:
  //import.meta.env.VITE_FIREBASE_API_KEY ??
  "AIzaSyBR4gCjiWo1i_fqlgNv3LSsOOWg8EI1z7c",
authDomain:
 // import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ??
  "prism-dc193.firebaseapp.com",
databaseURL:
  //import.meta.env.VITE_FIREBASE_DATABASE_URL ??
  "https://prism-dc193-default-rtdb.firebaseio.com",
projectId: 
//import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 
"prism-dc193",
storageBucket:
  //import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ??
  "prism-dc193.appspot.com",
messagingSenderId:
  //import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? 
  "736992613237",
appId:
 // import.meta.env.VITE_FIREBASE_APP_ID ??
  "1:736992613237:web:d4dd5a13b6cbd05690f93c",
measurementId: "G-NF3QTB95DN",
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);

  const title =
    payload.notification?.title ||
    payload.data?.title ||
    "PRISM Parking";

  const options = {
    body:
      payload.notification?.body ||
      payload.data?.body ||
      "Lot update",
    icon: "/pwa-192x192.png",
    data: {
      link: "/map",
      ...payload.data,
    },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.link || "/map";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});