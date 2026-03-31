// src/data/lotMeta.js
// Static metadata that shouldn't come from sensors.
// Keys MUST match your RTDB node names under /lots (LotA, LotB, etc.)
export const lotMeta = {
    LotA: {
      lat: 33.25324780616215,
      lon: -97.15408743711893,
    },
    LotB: {
      lat: 33.254149491888825,
      lon: -97.15014458985698,
    },
  
    // Add these only if you create them in RTDB:
    // LotC: { lat: 33.2092, lon: -97.1589 },
    // LotD: { lat: 33.2054, lon: -97.1490 },
  };
  
  export default lotMeta;

