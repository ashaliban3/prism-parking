// import { useEffect, useState, useCallback } from "react";
// import { ref, onValue, off } from "firebase/database";
// import { onAuthStateChanged } from "firebase/auth";
// import { db, auth } from "../firebaseClient";
// import lotMeta from "../data/lotMeta";

// // safer timestamp parsing
// function parseLastUpdate(lastUpdate) {
//   if (!lastUpdate) return null;
//   const t = Date.parse(lastUpdate);
//   return Number.isNaN(t) ? null : t;
// }

// export default function useParkingLots() {
//   const [lots, setLots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState("");

//   const [userReady, setUserReady] = useState(false);

//   // 🔑 AUTH LISTENER (separate responsibility)
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => {
//       console.log("🔐 Auth state:", user?.uid ?? null);
//       setUserReady(true); // even anonymous counts
//     });

//     return () => unsub();
//   }, []);

//   // 📡 DATA LISTENER (runs after auth resolves)
//   useEffect(() => {
//     if (!userReady) return;

//     const lotsRef = ref(db, "lots");

//     setLoading(true);

//     const unsubscribe = onValue(
//       lotsRef,
//       (snap) => {
//         const data = snap.val();

//         if (!data) {
//           setLots([]);
//           setError("No parking data available.");
//           setLoading(false);
//           setRefreshing(false);
//           return;
//         }

//         // 🔥 CRITICAL: always convert Firebase object → array
//         const parsedLots = Object.entries(data).map(([lotKey, lot]) => {
//           const meta = lotMeta[lotKey] || {};
//           console.log("lastUpdate raw:", lot.lastUpdate);
//           console.log("type:", typeof lot.lastUpdate);
//           const total =
//             typeof lot.totalCapacity === "number" ? lot.totalCapacity : 0;

//           const occupied =
//             typeof lot.currentOccupancy === "number"
//               ? Math.max(lot.currentOccupancy, 0)
//               : 0;

//           const available = Math.max(total - occupied, 0);

//           return {
//             id: lotKey,
//             name: lot.name || lotKey,
//             totalSpaces: total,
//             currentOccupancy: occupied,
//             available,
//             status: lot.status || null,
//             lastUpdated: parseLastUpdate(lot.lastUpdate),
//             lat: meta.lat ?? null,
//             lon: meta.lon ?? null,
//           };
//         });

//         console.log("✅ Lots parsed:", parsedLots);
        

//         setLots(parsedLots);
//         setError("");
//         setLoading(false);
//         setRefreshing(false);
//       },
//       (err) => {
//         console.error("❌ Firebase error:", err);

//         let message = "Failed to load parking data.";

//         if (err?.code === "PERMISSION_DENIED") {
//           message = "Permission denied. Check Firebase rules.";
//         }

//         setLots([]);
//         setError(message);
//         setLoading(false);
//         setRefreshing(false);
//       }
//     );

//     return () => off(lotsRef, "value", unsubscribe);
//   }, [userReady]);

//   // 🔄 REAL refresh (forces UI feedback)
//   const refreshLots = useCallback(() => {
//     setRefreshing(true);

//     // Firebase is real-time, so we just trigger UI state
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 800);
//   }, []);

//   return {
//     lots,          // ✅ always array
//     loading,
//     refreshing,
//     error,
//     refreshLots,
//   };
// }

import { useEffect, useState, useCallback } from "react";
import { ref, onValue, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseClient";
import lotMeta from "../data/lotMeta";

function parseLastUpdate(lastUpdate) {
  if (!lastUpdate) return null;
  const t = Date.parse(lastUpdate);
  return Number.isNaN(t) ? null : t;
}

function parseLotsData(data) {
  if (!data) return [];

  return Object.entries(data).map(([lotKey, lot]) => {
    const meta = lotMeta[lotKey] || {};

    const totalSpaces =
      typeof lot.totalCapacity === "number" ? lot.totalCapacity : 0;

    const currentOccupancy =
      typeof lot.currentOccupancy === "number"
        ? Math.max(lot.currentOccupancy, 0)
        : 0;

    const available = Math.max(totalSpaces - currentOccupancy, 0);

    return {
      id: lotKey,
      lotKey,
      name: lot.name || lotKey,
      totalSpaces,
      currentOccupancy,
      occupied: currentOccupancy,
      available,
      status: lot.status || null,
      lastUpdated: parseLastUpdate(lot.lastUpdate),
      lat: meta.lat ?? null,
      lon: meta.lon ?? null,
    };
  });
}

export default function useParkingLots() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      console.log("🔐 Auth state:", user?.uid ?? null);
      setUserReady(true);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!userReady) return;

    const lotsRef = ref(db, "lots");
    setLoading(true);

    const unsubscribe = onValue(
      lotsRef,
      (snap) => {
        const data = snap.val();

        if (!data) {
          setLots([]);
          setError("No parking data available.");
          setLoading(false);
          setRefreshing(false);
          return;
        }

        const parsedLots = parseLotsData(data);

        console.log("✅ Lots parsed from live listener:", parsedLots);

        setLots(parsedLots);
        setError("");
        setLoading(false);
        setRefreshing(false);
      },
      (err) => {
        console.error("❌ Firebase listener error:", err);

        let message = "Failed to load parking data.";
        if (err?.code === "PERMISSION_DENIED") {
          message = "Permission denied. Check Firebase rules.";
        }

        setLots([]);
        setError(message);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, [userReady]);

  const refreshLots = useCallback(async () => {
    const lotsRef = ref(db, "lots");
    const start = Date.now();
    const minimumSpinnerMs = 1000;

    try {
      setRefreshing(true);
      setError("");

      const snap = await get(lotsRef);
      const data = snap.val();

      if (!data) {
        setLots([]);
        setError("No parking data available.");
      } else {
        const parsedLots = parseLotsData(data);
        console.log("🔄 Lots parsed from manual refresh:", parsedLots);
        setLots(parsedLots);
      }
    } catch (err) {
      console.error("❌ Manual refresh failed:", err);

      let message = "Refresh failed. Please try again.";
      if (err?.code === "PERMISSION_DENIED") {
        message = "Permission denied. Check Firebase rules.";
      }

      setError(message);
    } finally {
      const elapsed = Date.now() - start;
      const remaining = minimumSpinnerMs - elapsed;

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      setRefreshing(false);
    }
  }, []);

  return {
    lots,
    loading,
    refreshing,
    error,
    refreshLots,
  };
}