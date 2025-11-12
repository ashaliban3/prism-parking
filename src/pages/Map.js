import { useState } from "react";
import { parkingLots } from "../data/parkingLots";

export default function Map() {
  const [filter, setFilter] = useState("all");

  const filteredLots = parkingLots.filter((lot) =>
    filter === "near" ? lot.distance <= 0.5 : true
  );

  return (
    <div className="p-6 mt-16">
      <h1 className="text-3xl font-bold mb-4">Find Parking</h1>

      <select
        className="border p-2 rounded mb-6"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All Lots</option>
        <option value="near">Within 0.5 miles</option>
      </select>

      {filteredLots.map((lot) => (
        <div key={lot.id} className="bg-white p-4 rounded shadow mb-3">
          <h2 className="font-semibold">{lot.name}</h2>
          <p>{lot.spaces} spaces • {lot.distance} mi away</p>
        </div>
      ))}
    </div>
  );
}
