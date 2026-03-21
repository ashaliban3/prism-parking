// import React from "react";

// export default function GoogleMapComponent({ lots = [], location }) {
//   return (
//     <div
//       className="rounded-xl border bg-white p-4 shadow"
//       style={{ minHeight: "220px" }}
//     >
//       <div className="mb-3 text-lg font-bold text-red-700">
//         Map removed for debugging
//       </div>

//       <div className="space-y-2 text-sm">
//         <div>
//           <strong>Lots count:</strong> {Array.isArray(lots) ? lots.length : 0}
//         </div>

//         <div>
//           <strong>Location:</strong>{" "}
//           {location
//             ? JSON.stringify(location)
//             : "No location object received"}
//         </div>

//         <div>
//           <strong>First lot:</strong>{" "}
//           {lots && lots.length > 0
//             ? JSON.stringify(lots[0], null, 2)
//             : "No lots loaded"}
//         </div>
//       </div>

//       {lots && lots.length > 0 && (
//         <div className="mt-4">
//           <div className="mb-2 font-semibold">Lots preview:</div>
//           <div className="space-y-2">
//             {lots.slice(0, 5).map((lot, index) => (
//               <div
//                 key={lot.id ?? index}
//                 className="rounded border p-2 text-sm"
//               >
//                 <div><strong>Name:</strong> {lot.name ?? "Unnamed lot"}</div>
//                 <div><strong>Lat:</strong> {String(lot.lat)}</div>
//                 <div><strong>Lon:</strong> {String(lot.lon)}</div>
//                 <div>
//                   <strong>Available:</strong> {String(lot.available)}
//                 </div>
//                 <div>
//                   <strong>Total:</strong> {String(lot.totalSpaces)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const LIBRARIES = ["places"];
const DEFAULT_CENTER = { lat: 33.2075, lng: -97.1521 };
const USER_DOT_SIZE = 32;

export default function GoogleMapComponent({ lots = [], location }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: LIBRARIES,
  });

  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const lotMarkersRef = useRef([]);

  const [userInteracted, setUserInteracted] = useState(false);
  const [activeLot, setActiveLot] = useState(null);

  const emeraldIconURL = `${import.meta.env.BASE_URL}icons/emerald-pin.svg`;
  const userDotURL = `${import.meta.env.BASE_URL}icons/user-dot-pulse.svg`;

  const initialCenter = useMemo(() => {
    if (location?.lat != null && location?.lon != null) {
      return { lat: Number(location.lat), lng: Number(location.lon) };
    }
    return DEFAULT_CENTER;
  }, [location]);

  const [mapCenter, setMapCenter] = useState(initialCenter);

  useEffect(() => {
    if (!userInteracted && location?.lat != null && location?.lon != null) {
      setMapCenter({ lat: Number(location.lat), lng: Number(location.lon) });
    }
  }, [location, userInteracted]);

  const clearLotMarkers = useCallback(() => {
    lotMarkersRef.current.forEach(({ marker, listeners }) => {
      try {
        listeners?.forEach((l) => l.remove());
      } catch {}
      try {
        marker.setMap(null);
      } catch {}
    });
    lotMarkersRef.current = [];
  }, []);

  const clearUserMarker = useCallback(() => {
    if (userMarkerRef.current) {
      try {
        userMarkerRef.current.setMap(null);
      } catch {}
      userMarkerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearLotMarkers();
      clearUserMarker();
    };
  }, [clearLotMarkers, clearUserMarker]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const g = window.google;
    if (!g?.maps) return;

    const map = mapRef.current;

    clearLotMarkers();
    clearUserMarker();

    if (location?.lat != null && location?.lon != null) {
      const lat = Number(location.lat);
      const lng = Number(location.lon);

      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        userMarkerRef.current = new g.maps.Marker({
          map,
          position: { lat, lng },
          icon: {
            url: userDotURL,
            scaledSize: new g.maps.Size(USER_DOT_SIZE, USER_DOT_SIZE),
          },
          clickable: false,
          zIndex: 999,
        });
      }
    }

    // TEMP TEST: disable lot markers to isolate Android slowness
lotMarkersRef.current = [];
    const created = [];
    lots.forEach((lot) => {
      const lat = Number(lot?.lat);
      const lng = Number(lot?.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const marker = new g.maps.Marker({
        map,
        position: { lat, lng },
        icon: {
          url: emeraldIconURL,
          scaledSize: new g.maps.Size(40, 40),

        },
      });

      const listeners = [
        marker.addListener("click", () => setActiveLot(lot)),
        marker.addListener("mouseover", () => setActiveLot(lot)),
        marker.addListener("mouseout", () => setActiveLot(null)),
      ];

      created.push({ marker, listeners });
    });

    lotMarkersRef.current = created;
  }, [
    isLoaded,
    lots,
    location,
    emeraldIconURL,
    userDotURL,
    clearLotMarkers,
    clearUserMarker,
  ]);

  if (loadError) {
    return (
      <div className="p-3 text-sm text-red-700 bg-red-50 rounded">
        Map failed to load: {String(loadError)}
      </div>
    );
  }

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "400px",
          borderRadius: "12px",
          touchAction: "manipulation",
        }}
        center={mapCenter}
        zoom={14}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onUnmount={() => {
          mapRef.current = null;
        }}
        onDragStart={() => setUserInteracted(true)}
        onTouchStart={() => setUserInteracted(true)}

        onIdle={() => {
          const map = mapRef.current;
          if (!map) return;
          const c = map.getCenter();
          if (!c) return;
          setMapCenter({ lat: c.lat(), lng: c.lng() });
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          clickableIcons: false,
          draggableCursor: "grab",
          draggingCursor: "grabbing",
        }}
      />

      {activeLot && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-3 rounded-lg shadow-xl border text-sm pointer-events-none z-20">
          <div className="font-bold text-emerald-700 text-lg">
            {activeLot.name}
          </div>
          <p>
            {activeLot.currentOccupancy} / {activeLot.totalSpaces} occupied
          </p>
        </div>
      )}

      <div className="absolute bottom-4 left-4 flex flex-col gap-3 z-30 pointer-events-none">
        <button
          type="button"
          onClick={() => {
            setUserInteracted(false);
            const map = mapRef.current;
            if (location?.lat != null && location?.lon != null && map) {
              const newCenter = {
                lat: Number(location.lat),
                lng: Number(location.lon),
              };
              setMapCenter(newCenter);
              map.panTo(newCenter);
            }
          }}
          className="pointer-events-auto bg-white p-3 rounded-full shadow-lg border hover:bg-gray-100 transition"
          aria-label="Recenter map"
        >
          📍
        </button>
      </div>
    </div>
  );

  console.log("Starting maps load");
console.log("Native platform:", Capacitor.isNativePlatform());
console.log("Using key prefix:", apiKey?.slice(0, 8));

script.onload = () => console.log("Maps script loaded");
script.onerror = (e) => console.error("Maps script failed", e);

}
