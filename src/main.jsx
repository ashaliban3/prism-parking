import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Capacitor } from "@capacitor/core";

console.log("Maps key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.slice(0,6));


const isNative = Capacitor.isNativePlatform();

if (isNative && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => regs.forEach((reg) => reg.unregister()))
    .catch(() => {});
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
