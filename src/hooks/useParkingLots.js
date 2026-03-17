
// import { useEffect, useMemo, useState } from "react";
// import { ref, onValue } from "firebase/database";
// import { db } from "../firebaseClient"; // <-- make sure you have src/firebase.js exporting db
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
//     const lotsRef = ref(db, "lots");

//     const unsubscribe = onValue(
//       lotsRef,
//       (snap) => {
//         const data = snap.val() || {};

//         const arr = Object.entries(data).map(([lotKey, lot]) => {
//           const meta = lotMeta[lotKey] || {};

//           const totalSpaces =
//             typeof lot.totalCapacity === "number" ? lot.totalCapacity : 0;

//           const currentOccupancy =
//             typeof lot.currentOccupancy === "number" ? lot.currentOccupancy : 0;

//           const available = Math.max(totalSpaces - currentOccupancy, 0);

//           return {
//             id: lotKey,                 // stable key for React + your UI
//             lotKey,                     // useful for debugging
//             name: lot.name || lotKey,
//             totalSpaces,
//             currentOccupancy,
//             available,
//             status: lot.status || null,
//             lastUpdated: parseLastUpdate(lot.lastUpdate),
//             lat: meta.lat ?? null,
//             lon: meta.lon ?? null,
//           };
//         });

//         setLots(arr);
//         setLoading(false);
//         setError(null);
//       },
//       (err) => {
//         console.error("RTDB /lots listener error:", err);
//         setError("Unable to load lots from Firebase.");
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   return { lots, loading, error };
// }

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseClient";
import lotMeta from "../data/lotMeta";

function parseLastUpdate(lastUpdate) {
  if (!lastUpdate) return Date.now();
  const t = Date.parse(lastUpdate);
  return Number.isNaN(t) ? Date.now() : t;
}

export default function useParkingLots() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribeLots = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      const lotsRef = ref(db, "lots");

      unsubscribeLots = onValue(
        lotsRef,
        (snap) => {
          const data = snap.val() || {};

          const arr = Object.entries(data).map(([lotKey, lot]) => {
            const meta = lotMeta[lotKey] || {};

            const totalSpaces =
              typeof lot.totalCapacity === "number" ? lot.totalCapacity : 0;

            const currentOccupancy =
              typeof lot.currentOccupancy === "number" ? lot.currentOccupancy : 0;

            const available = Math.max(totalSpaces - currentOccupancy, 0);

            return {
              id: lotKey,
              lotKey,
              name: lot.name || lotKey,
              totalSpaces,
              currentOccupancy,
              available,
              status: lot.status || null,
              lastUpdated: parseLastUpdate(lot.lastUpdate),
              lat: meta.lat ?? null,
              lon: meta.lon ?? null,
            };
          });

          setLots(arr);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error("RTDB /lots listener error:", err);
          setError(`Unable to load lots from Firebase: ${err.message}`);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeLots) unsubscribeLots();
    };
  }, []);

  return { lots, loading, error };
}