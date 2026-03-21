// import { useEffect, useState } from "react";
// import { ref, onValue, get } from "firebase/database";
// import { db } from "../firebaseClient";

// export default function useParkingLots() {
//   const [lots, setLots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     console.log("🔥 useParkingLots mounted");
//     console.log("📥 Subscribing directly to /lots");

//     const lotsRef = ref(db, "lots");

//     // one-time read for debugging
//     get(lotsRef)
//       .then((snapshot) => {
//         const data = snapshot.val();
//         console.log("🧪 get(/lots) exists:", snapshot.exists());
//         console.log("🧪 get(/lots) raw:", data);
//         console.log("🧪 get(/lots) keys:", data ? Object.keys(data) : []);
//       })
//       .catch((err) => {
//         console.error("❌ get(/lots) failed:", err);
//       });

//     const unsubscribe = onValue(lotsRef, (snapshot) => {
//   console.log("snapshot exists:", snapshot.exists());
//   console.log("snapshot key:", snapshot.key);
//   console.log("snapshot raw val:", snapshot.val());

//   const value = snapshot.val();
//   if (!value) {
//     console.log("No lots data returned from RTDB");
//     setLots([]);
//     setLoading(false);
//     return;
//   }

//   const parsed = Object.entries(value).map(([id, lot]) => ({
//     id,
//     ...lot,
//   }));

//   console.log("Parsed lots:", parsed);
//   setLots(parsed);
//   setLoading(false);
// }, (err) => {
//   console.error("RTDB onValue error:", err);
//   setError(err.message);
//   setLoading(false);
// });

//     return () => {
//       console.log("🧹 Cleaning up /lots listener");
//       unsubscribe();
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
      console.log("🔥 useParkingLots auth changed:", user?.uid ?? null);

      // Wait for anonymous auth to finish instead of treating null as an error
      if (!user) {
        setLoading(true);
        return;
      }

      const lotsRef = ref(db, "lots");

      if (unsubscribeLots) {
        unsubscribeLots();
      }

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
              occupied: currentOccupancy,
              available,
              status: lot.status || null,
              lastUpdated: parseLastUpdate(lot.lastUpdate),
              lat: meta.lat ?? null,
              lon: meta.lon ?? null,
            };
          });

          console.log("✅ Parsed lots:", arr);

          setLots(arr);
          setError(null);
          setLoading(false);
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