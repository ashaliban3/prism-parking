// src/hooks/useLocation.js
import { useEffect, useRef, useState } from "react";

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      // Only import Capacitor plugin when needed (and avoid breaking web)
      let Capacitor, Geolocation;
      try {
        ({ Capacitor } = await import("@capacitor/core"));
        ({ Geolocation } = await import("@capacitor/geolocation"));
      } catch (e) {
        // If capacitor packages aren't available in this environment, fall back to browser geolocation
      }

      const isNative = !!Capacitor?.isNativePlatform?.() && Capacitor.isNativePlatform();

      const onSuccess = (pos) => {
        if (cancelled) return;
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setError(null);
      };

      const onError = (err) => {
        if (cancelled) return;
        const code = err?.code;
        if (code === 1) setError("Location permission denied.");
        else if (code === 2) setError("Position unavailable.");
        else if (code === 3) setError("Location request timed out.");
        else setError(err?.message || "Unable to retrieve location.");
      };

      const geoOptions = { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 };

      // --- Native (Capacitor) path ---
      if (isNative && Geolocation) {
        try {
          await Geolocation.requestPermissions();

          // initial
          const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
          onSuccess(pos);

          // watch
          const watchId = await Geolocation.watchPosition(
            { enableHighAccuracy: true },
            (pos, err) => {
              if (err) return onError(err);
              if (pos) onSuccess(pos);
            }
          );

          watchIdRef.current = watchId;
          return;
        } catch (e) {
          onError(e);
          return;
        }
      }

      // --- Web path ---
      if (!("geolocation" in navigator)) {
        setError("Geolocation is not supported on this device.");
        return;
      }

      const isSecure =
        window.location.protocol === "https:" || window.location.hostname === "localhost";
      if (!isSecure) {
        setError("Geolocation requires HTTPS (or localhost).");
        return;
      }

      navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);

      watchIdRef.current = navigator.geolocation.watchPosition(
        onSuccess,
        (err) => {
          // keep minimal while tracking
          if (err?.code === 1) setError("Location permission denied.");
        },
        geoOptions
      );
    }

    start();

    return () => {
      cancelled = true;

      // web cleanup
      if (watchIdRef.current != null && typeof watchIdRef.current === "number") {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }

      // native cleanup (best-effort)
      // (watchId can be string in Capacitor)
      (async () => {
        try {
          const { Capacitor } = await import("@capacitor/core");
          if (Capacitor.isNativePlatform()) {
            const { Geolocation } = await import("@capacitor/geolocation");
            if (watchIdRef.current != null) {
              await Geolocation.clearWatch({ id: watchIdRef.current });
            }
          }
        } catch {}
      })();
    };
  }, []);

  return { location, error };
}