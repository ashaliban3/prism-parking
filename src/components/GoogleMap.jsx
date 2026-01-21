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

  // Marker refs (cleanup safe)
  const userMarkerRef = useRef(null);
  const lotMarkersRef = useRef([]); // [{ marker, listeners: [] }]

  const [userInteracted, setUserInteracted] = useState(false);
  const [activeLot, setActiveLot] = useState(null);

  // If these live in /public/icons, keep them like this:
  const emeraldIconURL = `${import.meta.env.BASE_URL}icons/emerald-pin.svg`;
  const userDotURL = `${import.meta.env.BASE_URL}icons/user-dot-pulse.svg`;

  const initialCenter = useMemo(() => {
    if (location?.lat != null && location?.lon != null) {
      return { lat: Number(location.lat), lng: Number(location.lon) };
    }
    return DEFAULT_CENTER;
  }, [location]);

  const [mapCenter, setMapCenter] = useState(initialCenter);

  // Center ONCE when location arrives (unless user moved map)
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

  // Create/update markers
  useEffect(() => {
    if (!isLoaded) return;
    if (!mapRef.current) return;

    const g = window.google;
    if (!g?.maps) return;

    const map = mapRef.current;

    clearLotMarkers();
    clearUserMarker();

    // USER MARKER
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

    // LOT MARKERS
    const created = [];
    (lots || []).forEach((lot) => {
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
          touchAction: "manipulation", // ✅ helps Safari/trackpad click/drag oddness
          outline: "3px solid red",
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
          clickableIcons: false, // ✅ reduces weird click targets
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
            {activeLot.available} / {activeLot.totalSpaces} spaces
          </p>
        </div>
      )}

      {/* CONTROLS: stack so nothing overlaps */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-30 pointer-events-none">
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
}
