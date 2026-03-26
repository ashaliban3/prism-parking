
// import React, { useMemo, useState } from "react";
// import { getStatus, statusColors } from "../utils/statusHelpers";
// import useLocation from "../hooks/useLocation";
// import useParkingLots from "../hooks/useParkingLots";
// import GoogleMapComponent from "../components/GoogleMap";

// function haversineMiles(aLat, aLon, bLat, bLon) {
//   const toRad = (x) => (x * Math.PI) / 180;
//   const R = 3958.8;
//   const dLat = toRad(bLat - aLat);
//   const dLon = toRad(bLon - aLon);

//   const s1 = Math.sin(dLat / 2) ** 2;
//   const s2 =
//     Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;

//   return 2 * R * Math.asin(Math.sqrt(s1 + s2));
// }

// export default function Map() {
//   const { location, error: locationError } = useLocation();
//   const {
//     lots: rawLots,
//     loading: lotsLoading,
//     error: lotsError,
//   } = useParkingLots();

//   const [filter, setFilter] = useState("all");

//   const lotsWithDistance = useMemo(() => {
//     return rawLots.map((lot) => {
//       const hasCoords = lot.lat != null && lot.lon != null;
//       const hasUser = location?.lat != null && location?.lon != null;

//       const distance =
//         hasCoords && hasUser
//           ? haversineMiles(location.lat, location.lon, lot.lat, lot.lon)
//           : Number.POSITIVE_INFINITY;

//       return {
//         ...lot,
//         distance,
//       };
//     });
//   }, [rawLots, location]);

//   const filteredLots = useMemo(() => {
//     const sorted = [...lotsWithDistance].sort((a, b) => a.distance - b.distance);

//     return sorted.filter((lot) => {
//       if (filter === "near") return lot.distance <= 0.5;
//       return true;
//     });
//   }, [lotsWithDistance, filter]);

//   return (
//     <div className="p-6 mt-16 bg-gradient-to-b from-emerald-50 to-white min-h-screen">
//       <h1 className="text-3xl font-bold mb-4 text-emerald-700">Find Parking</h1>

//       {location && (
//         <p className="text-sm text-gray-600 mb-2">
//           Your location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
//         </p>
//       )}

//       {locationError && (
//         <p className="text-sm text-red-500 mb-2">{locationError}</p>
//       )}
//       {lotsError && <p className="text-sm text-red-500 mb-2">{lotsError}</p>}

//       {lotsLoading && (
//         <p className="text-sm text-gray-600 mb-4">Loading live lot data...</p>
//       )}

//       <div className="flex items-center space-x-4 mb-6">
//         <label className="text-gray-700 font-medium">Filter:</label>
//         <select
//           className="border p-2 rounded"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         >
//           <option value="all">All Lots</option>
//           <option value="near">Within 0.5 miles</option>
//         </select>
//       </div>

//       <div className="mb-10">
//         <GoogleMapComponent lots={filteredLots} location={location} />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredLots.map((lot) => {
//           const status = getStatus(lot.available, lot.totalSpaces);

//           const distanceText =
//             Number.isFinite(lot.distance) && lot.distance !== Number.POSITIVE_INFINITY
//               ? `${lot.distance.toFixed(2)} mi away`
//               : "Distance unavailable";

//           const updatedText = Number.isFinite(lot.lastUpdated)
//             ? new Date(lot.lastUpdated).toLocaleTimeString()
//             : "Unknown";

//           return (
//             <div
//               key={lot.id}
//               className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition"
//             >
//               <h2 className="font-semibold text-lg text-gray-800">{lot.name}</h2>

//               <p className="text-gray-500 text-sm">
//                 {lot.currentOccupancy} / {lot.totalSpaces} spaces occupied • {distanceText}
//               </p>

//               <p className="text-xs text-gray-400">Updated {updatedText}</p>

//               <div
//                 className={`mt-3 inline-block px-3 py-1 rounded-full text-sm border font-medium ${statusColors[status]}`}
//               >
//                 {status === "high"
//                   ? "Plenty of spots"
//                   : status === "medium"
//                   ? "Limited spots"
//                   : status === "low"
//                   ? "Almost full"
//                   : "Full"}
//               </div>

//               <button
//                 className="block w-full mt-5 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all"
//                 onClick={() => alert(`Reserved at ${lot.name}!`)}
//               >
//                 Reserve Spot
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import React, { useMemo, useState } from "react";
import { getStatus, statusColors } from "../utils/statusHelpers";
import useLocation from "../hooks/useLocation";
import useParkingLots from "../hooks/useParkingLots";
import GoogleMapComponent from "../components/GoogleMap";

function haversineMiles(aLat, aLon, bLat, bLon) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);

  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 =
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(s1 + s2));
}

export default function MapPage() {
  const { location, error: locationError } = useLocation();
  const {
    lots: rawLots,
    loading: lotsLoading,
    refreshing,
    error: lotsError,
    refreshLots,
  } = useParkingLots();

  const [filter, setFilter] = useState("all");

  const lotsWithDistance = useMemo(() => {
    return rawLots.map((lot) => {
      const hasCoords = lot.lat != null && lot.lon != null;
      const hasUser = location?.lat != null && location?.lon != null;

      const distance =
        hasCoords && hasUser
          ? haversineMiles(location.lat, location.lon, lot.lat, lot.lon)
          : Number.POSITIVE_INFINITY;

      return {
        ...lot,
        distance,
      };
    });
  }, [rawLots, location]);

  const filteredLots = useMemo(() => {
    const sorted = [...lotsWithDistance].sort((a, b) => a.distance - b.distance);

    return sorted.filter((lot) => {
      if (filter === "near") return lot.distance <= 0.5;
      return true;
    });
  }, [lotsWithDistance, filter]);

  return (
    <div className="p-6 mt-16 bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h1 className="text-3xl font-bold text-emerald-700">Find Parking</h1>

        <button
          onClick={refreshLots}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {location && (
        <p className="text-sm text-gray-600 mb-2">
          Your location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
        </p>
      )}

      {locationError && (
        <p className="text-sm text-red-500 mb-2">{locationError}</p>
      )}

      {lotsError && (
        <p className="text-sm text-red-500 mb-2">{lotsError}</p>
      )}

      {lotsLoading && (
        <p className="text-sm text-gray-600 mb-4">Loading live lot data...</p>
      )}

      <div className="flex items-center space-x-4 mb-6">
        <label className="text-gray-700 font-medium">Filter:</label>
        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Lots</option>
          <option value="near">Within 0.5 miles</option>
        </select>
      </div>

      <div className="mb-10">
        <GoogleMapComponent lots={filteredLots} location={location} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLots.map((lot) => {
          const status = getStatus(lot.available, lot.totalSpaces);

          const distanceText =
            Number.isFinite(lot.distance) &&
            lot.distance !== Number.POSITIVE_INFINITY
              ? `${lot.distance.toFixed(2)} mi away`
              : "Distance unavailable";
              
          const updatedText = Number.isFinite(lot.lastUpdated)
            ? new Date(lot.lastUpdated).toLocaleTimeString()
            : "Unknown";

           

          return (
            <div
              key={lot.id}
              className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg text-gray-800">{lot.name}</h2>

              <p className="text-gray-500 text-sm">
                {lot.currentOccupancy} / {lot.totalSpaces} spaces occupied •{" "}
                {distanceText}
              </p>

              <p className="text-xs text-gray-400">Updated {updatedText}</p>

              <div
                className={`mt-3 inline-block px-3 py-1 rounded-full text-sm border font-medium ${statusColors[status]}`}
              >
                {status === "high"
                  ? "Plenty of spots"
                  : status === "medium"
                  ? "Limited spots"
                  : status === "low"
                  ? "Almost full"
                  : "Full"}
              </div>

              <button
                className="block w-full mt-5 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all"
                onClick={() => alert(`Reserved at ${lot.name}!`)}
              >
                Reserve Spot
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
