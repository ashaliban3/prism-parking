// src/hooks/useLocation.js
import { useEffect, useRef, useState } from "react";

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported on this device.");
      return;
    }

    // Browsers require HTTPS for geolocation (localhost is okay).
    const isSecure =
      window.location.protocol === "https:" || window.location.hostname === "localhost";
    if (!isSecure) {
      setError("Geolocation requires HTTPS (or localhost).");
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    };

    const onSuccess = (pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
      setError(null);
    };

    const onError = (err) => {
      if (err.code === 1) setError("Location permission denied.");
      else if (err.code === 2) setError("Position unavailable.");
      else if (err.code === 3) setError("Location request timed out.");
      else setError("Unable to retrieve location.");
    };

    // One-time initial fix
    navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);

    // Continuous tracking
    watchIdRef.current = navigator.geolocation.watchPosition(
      onSuccess,
      (err) => {
        // Keep error message minimal while tracking
        if (err.code === 1) setError("Location permission denied.");
      },
      geoOptions
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { location, error };
}