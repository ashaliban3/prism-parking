

// import { useEffect, useState } from "react";
// import { ref, onValue } from "firebase/database";
// import { onAuthStateChanged } from "firebase/auth";
// import { db, auth } from "../firebaseClient";
// import lotMeta from "../data/lotMeta";

// function parseLastUpdate(lastUpdate) {
//   if (!lastUpdate) return Date.now();
//   const t = Date.parse(lastUpdate);
//   return Number.isNaN(t) ? Date.now() : t;
// }

// export default function useParkingLots() {
//   const [lots, setLots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let unsubscribeLots = null;

//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       console.log("🔥 useParkingLots auth changed:", user?.uid ?? null);

//       // Wait for anonymous auth to finish instead of treating null as an error
//       if (!user) {
//         setLoading(true);
//         return;
//       }

//       const lotsRef = ref(db, "lots");

//       if (unsubscribeLots) {
//         unsubscribeLots();
//       }

//       unsubscribeLots = onValue(
//         lotsRef,
//         (snap) => {
//           const data = snap.val() || {};

//           const arr = Object.entries(data).map(([lotKey, lot]) => {
//             const meta = lotMeta[lotKey] || {};

//             const totalSpaces =
//               typeof lot.totalCapacity === "number" ? lot.totalCapacity : 0;

//             const currentOccupancy =
//               typeof lot.currentOccupancy === "number" ? lot.currentOccupancy : 0;

//             const available = Math.max(totalSpaces - currentOccupancy, 0);

//             return {
//               id: lotKey,
//               lotKey,
//               name: lot.name || lotKey,
//               totalSpaces,
//               currentOccupancy,
//               occupied: currentOccupancy,
//               available,
//               status: lot.status || null,
//               lastUpdated: parseLastUpdate(lot.lastUpdate),
//               lat: meta.lat ?? null,
//               lon: meta.lon ?? null,
//             };
//           });

//           console.log("✅ Parsed lots:", arr);

//           setLots(arr);
//           setError(null);
//           setLoading(false);
//         },
//         (err) => {
//           console.error("RTDB /lots listener error:", err);
//           setError(`Unable to load lots from Firebase: ${err.message}`);
//           setLoading(false);
//         }
//       );
//     });

//     return () => {
//       unsubscribeAuth();
//       if (unsubscribeLots) unsubscribeLots();
//     };
//   }, []);

//   return { lots, loading, error };
// }
import { useEffect, useState, useCallback } from "react";
import { ref, onValue, off } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseClient";
import lotMeta from "../data/lotMeta";

// safer timestamp parsing
function parseLastUpdate(lastUpdate) {
  if (!lastUpdate) return null;
  const t = Date.parse(lastUpdate);
  return Number.isNaN(t) ? null : t;
}

export default function useParkingLots() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [userReady, setUserReady] = useState(false);

  // 🔑 AUTH LISTENER (separate responsibility)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("🔐 Auth state:", user?.uid ?? null);
      setUserReady(true); // even anonymous counts
    });

    return () => unsub();
  }, []);

  // 📡 DATA LISTENER (runs after auth resolves)
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

        // 🔥 CRITICAL: always convert Firebase object → array
        const parsedLots = Object.entries(data).map(([lotKey, lot]) => {
          const meta = lotMeta[lotKey] || {};
          console.log("lastUpdate raw:", lot.lastUpdate);
          console.log("type:", typeof lot.lastUpdate);
          const total =
            typeof lot.totalCapacity === "number" ? lot.totalCapacity : 0;

          const occupied =
            typeof lot.currentOccupancy === "number"
              ? Math.max(lot.currentOccupancy, 0)
              : 0;

          const available = Math.max(total - occupied, 0);

          return {
            id: lotKey,
            name: lot.name || lotKey,
            totalSpaces: total,
            currentOccupancy: occupied,
            available,
            status: lot.status || null,
            lastUpdated: parseLastUpdate(lot.lastUpdate),
            lat: meta.lat ?? null,
            lon: meta.lon ?? null,
          };
        });

        console.log("✅ Lots parsed:", parsedLots);
        

        setLots(parsedLots);
        setError("");
        setLoading(false);
        setRefreshing(false);
      },
      (err) => {
        console.error("❌ Firebase error:", err);

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

    return () => off(lotsRef, "value", unsubscribe);
  }, [userReady]);

  // 🔄 REAL refresh (forces UI feedback)
  const refreshLots = useCallback(() => {
    setRefreshing(true);

    // Firebase is real-time, so we just trigger UI state
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  return {
    lots,          // ✅ always array
    loading,
    refreshing,
    error,
    refreshLots,
  };
}