import React, { useState } from "react";
import parkingLots from "../data/parkingLots";

function StatusPill({ status }) {
  const map = {
    available: "bg-green-100 text-green-700",
    limited: "bg-yellow-100 text-yellow-800",
    full: "bg-red-100 text-red-700"
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

export default function MapPlaceholder() {
  const [filterDistance, setFilterDistance] = useState("all");
  const [lots] = useState(parkingLots);

  const filtered = lots.filter(l => {
    if (filterDistance === "all") return true;
    if (filterDistance === "0.5") return l.distance <= 0.5;
    if (filterDistance === "1") return l.distance <= 1;
    return true;
  });

  const handleReserve = (lot) => {
    // demo action — later replace with backend call
    alert(`Reserved a spot at ${lot.name} (demo).`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Nearby parking</h1>
          <p className="text-gray-600">Showing nearby lots with demo data.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Filter:</label>
          <select
            value={filterDistance}
            onChange={(e) => setFilterDistance(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All distances</option>
            <option value="0.5">Within 0.5 mi</option>
            <option value="1">Within 1 mi</option>
          </select>
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(lot => (
          <div key={lot.id} className="bg-white p-4 rounded shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{lot.name}</h2>
                <StatusPill status={lot.status} />
              </div>

              <div className="mt-2 text-sm text-gray-600">
                <div>{lot.spaces} spaces</div>
                <div>{lot.distance} mi away</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => handleReserve(lot)}
                className={`px-3 py-2 rounded text-white ${lot.status === "full" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                disabled={lot.status === "full"}
              >
                Reserve
              </button>

              <button
                onClick={() => alert(`More details for ${lot.name} (demo).`)}
                className="text-sm text-gray-600 underline"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-gray-600">No lots match that filter.</div>
      )}
    </div>
  );
}
