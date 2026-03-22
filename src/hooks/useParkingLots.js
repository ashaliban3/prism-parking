

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
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseClient";
import lotMeta from "../data/lotMeta";

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

  useEffect(() => {
    let unsubscribeLots = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      console.log("🔥 useParkingLots auth changed:", user?.uid ?? null);

      if (unsubscribeLots) {
        unsubscribeLots();
        unsubscribeLots = null;
      }

      setLots([]);
      setError("");

      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const lotsRef = ref(db, "lots");

      unsubscribeLots = onValue(
        lotsRef,
        (snap) => {
          const data = snap.val();

          if (!data) {
            setLots([]);
            setError("No live parking lot data is available right now.");
            setLoading(false);
            setRefreshing(false);
            return;
          }

          const arr = Object.entries(data).map(([lotKey, lot]) => {
            const meta = lotMeta[lotKey] || {};

            const totalSpaces =
              typeof lot.totalCapacity === "number" ? lot.totalCapacity : 0;

            const currentOccupancy =
              typeof lot.currentOccupancy === "number" ? lot.currentOccupancy : 0;

            const safeOccupancy = Math.max(currentOccupancy, 0);
            const available = Math.max(totalSpaces - safeOccupancy, 0);

            return {
              id: lotKey,
              lotKey,
              name: lot.name || lotKey,
              totalSpaces,
              currentOccupancy: safeOccupancy,
              occupied: safeOccupancy,
              available,
              status: lot.status || null,
              lastUpdated: parseLastUpdate(lot.lastUpdate),
              lat: meta.lat ?? null,
              lon: meta.lon ?? null,
            };
          });

          console.log("✅ Parsed lots:", arr);

          setLots(arr);
          setError("");
          setLoading(false);
          setRefreshing(false);
        },
        (err) => {
          console.error("RTDB /lots listener error:", err);

          let message = "Unable to load live parking data.";

          if (
            err?.code === "PERMISSION_DENIED" ||
            err?.message?.toLowerCase().includes("permission")
          ) {
            message =
              "Access denied. Your account does not have permission to view parking data.";
          } else if (err?.message) {
            message = `Unable to load live parking data: ${err.message}`;
          }

          setLots([]);
          setError(message);
          setLoading(false);
          setRefreshing(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeLots) unsubscribeLots();
    };
  }, []);

  const refreshLots = () => {
    setRefreshing(true);
  };

  return { lots, loading, refreshing, error, refreshLots };
}