// src/data/lotMeta.js
// Static metadata that shouldn't come from sensors.
// Keys MUST match your RTDB node names under /lots (LotA, LotB, etc.)
export const lotMeta = {
    LotA: {
      lat: 33.2075,
      lon: -97.1521,
    },
    LotB: {
      lat: 33.2101,
      lon: -97.1532,
    },
  
    // Add these only if you create them in RTDB:
    // LotC: { lat: 33.2092, lon: -97.1589 },
    // LotD: { lat: 33.2054, lon: -97.1490 },
  };
  
  export default lotMeta;