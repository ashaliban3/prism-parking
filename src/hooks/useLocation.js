import { useState, useEffect, useRef } from "react";

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported on this device.");
      return;
    }

    // --- OPTIONS to make iOS more stable ---
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 8000,          // fail fast if iOS delays the response
      maximumAge: 0,          // do NOT reuse stale cached positions
    };

    // --- FIRST FIX: request a one-time location immediately ---
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        if (err.code === 1) {
          setError("Location permission denied.");
        } else if (err.code === 2) {
          setError("Position unavailable.");
        } else if (err.code === 3) {
          setError("Location request timed out.");
        } else {
          setError("Unable to retrieve location.");
        }
      },
      geoOptions
    );

    // --- SECOND FIX: start continuous tracking (iOS-friendly) ---
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        if (err.code === 1) {
          setError("Location permission denied.");
        } else {
          setError("Unable to track location.");
        }
      },
      geoOptions
    );

    // --- CLEANUP: stop tracking on unmount ---
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { location, error };
}
