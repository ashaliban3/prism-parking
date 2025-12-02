// src/data/parkingLots.js

const parkingLots = [
  {
    id: 1,
    name: "Lot A",
    totalSpaces: 130,
    available: 60,
    distance: 0.3,
    lat: 33.2075,
    lon: -97.1521,
    lastUpdated: Date.now(),
  },
  {
    id: 2,
    name: "Garage B",
    totalSpaces: 50,
    available: 10,
    distance: 0.6,
    lat: 33.2101,
    lon: -97.1532,
    lastUpdated: Date.now(),
  },
  {
    id: 3,
    name: "Lot C",
    totalSpaces: 200,
    available: 150,
    distance: 1.1,
    lat: 33.2092,
    lon: -97.1589,
    lastUpdated: Date.now(),
  },
  {
    id: 4,
    name: "Lot D",
    totalSpaces: 30,
    available: 0,
    distance: 0.8,
    lat: 33.2054,
    lon: -97.1490,
    lastUpdated: Date.now(),
  },
];

export default parkingLots;
