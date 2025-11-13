import { useEffect, useState } from "react";
import parkingLotsData from "../data/parkingLots";
import { getStatus, statusColors } from "../utils/statusHelpers";
import useLocation from "../hooks/useLocation";
import GoogleMapComponent from "../components/GoogleMap";

export default function Map() {
  const { location, error: locationError } = useLocation();

  const [lots, setLots] = useState([]);
  const [filter, setFilter] = useState("all");

  // Update lots every 10 seconds to simulate backend updates
  useEffect(() => {
    const updateLots = () => {
      const updated = parkingLotsData.map((lot) => ({
        ...lot,
        available: Math.max(
          0,
          Math.min(
            lot.totalSpaces,
            lot.available + Math.floor(Math.random() * 10 - 5)
          )
        ),
        lastUpdated: Date.now(),
      }));

      setLots(updated);
    };

    updateLots();
    const interval = setInterval(updateLots, 10000);
    return () => clearInterval(interval);
  }, []);

  // Apply filter
  const filteredLots = lots
    .sort((a, b) => a.distance - b.distance)
    .filter((lot) => {
      if (filter === "near") return lot.distance <= 0.5;
      return true;
    });

  return (
    <div className="p-6 mt-16 bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-emerald-700">Find Parking</h1>

      {/* User location */}
      {location && (
        <p className="text-sm text-gray-600 mb-2">
          Your location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
        </p>
      )}

      {/* Location error */}
      {locationError && (
        <p className="text-sm text-red-500 mb-2">{locationError}</p>
      )}

      {/* Filter */}
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

      {/* Google Map (fully working) */}
      <div className="mb-10">
        <GoogleMapComponent lots={filteredLots} location={location} />
      </div>

      {/* Grid of lot cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLots.map((lot) => {
          const status = getStatus(lot.available, lot.totalSpaces);

          return (
            <div
              key={lot.id}
              className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition"
            >
              {/* Lot name */}
              <h2 className="font-semibold text-lg text-gray-800">
                {lot.name}
              </h2>

              {/* Capacity + distance */}
              <p className="text-gray-500 text-sm">
                {lot.available} / {lot.totalSpaces} spaces • {lot.distance} mi away
              </p>

              {/* Last updated */}
              <p className="text-xs text-gray-400">
                Updated {new Date(lot.lastUpdated).toLocaleTimeString()}
              </p>

              {/* Status badge */}
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

              {/* Reserve button */}
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
