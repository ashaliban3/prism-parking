/* global google */
import { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

export default function GoogleMapComponent({ lots, location }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDWSSFGxGkvtkErzD0HkvER7og8gompwfE",
    version: "weekly",
    libraries: ["places"],
  });

  const mapRef = useRef(null);

  // Track if user dragged the map
  const [userInteracted, setUserInteracted] = useState(false);

  // Track the persistent map center
  const [mapCenter, setMapCenter] = useState(
    location
      ? { lat: location.lat, lng: location.lon }
      : { lat: 33.2075, lng: -97.1521 }
  );

  const [activeLot, setActiveLot] = useState(null);

  // ICONS
  const emeraldIconURL = "/icons/emerald-pin.svg";

  // ⭐ CHANGE THIS SIZE TO MAKE THE USER DOT BIGGER ⭐
  const userDotURL = "/icons/user-dot-pulse.svg";
  const USER_DOT_SIZE = 32; // make this larger if you want (20 → 32 → 40)

  // When location loads for the first time, center the map ONCE
  useEffect(() => {
    if (location && !userInteracted) {
      setMapCenter({ lat: location.lat, lng: location.lon });
    }
  }, [location, userInteracted]);

  // Draw markers
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = mapRef.current;

    if (!map.__markers) map.__markers = [];

    // Clear old markers
    map.__markers.forEach((m) => m.setMap(null));
    map.__markers = [];

    // USER MARKER (with larger icon)
    if (location) {
      const userMarker = new google.maps.Marker({
        map,
        position: { lat: location.lat, lng: location.lon },
        icon: {
          url: userDotURL,
          scaledSize: new google.maps.Size(USER_DOT_SIZE, USER_DOT_SIZE),
        },
      });
      map.__markers.push(userMarker);
    }

    // LOT MARKERS
    lots.forEach((lot) => {
      const marker = new google.maps.Marker({
        map,
        position: { lat: lot.lat, lng: lot.lon },
        icon: {
          url: emeraldIconURL,
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      marker.addListener("click", () => setActiveLot(lot));
      marker.addListener("mouseover", () => setActiveLot(lot));
      marker.addListener("mouseout", () => setActiveLot(null));

      map.__markers.push(marker);
    });
  }, [isLoaded, lots, location]);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "400px",
          borderRadius: "12px",
        }}
        center={mapCenter}
        zoom={14}
        onLoad={(map) => (mapRef.current = map)}
        onDragStart={() => setUserInteracted(true)}
        onIdle={() => {
          if (mapRef.current) {
            const c = mapRef.current.getCenter();
            setMapCenter({ lat: c.lat(), lng: c.lng() });
          }
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      />

      {/* LOT INFO POPUP */}
      {activeLot && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-3 rounded-lg shadow-xl border text-sm">
          <div className="font-bold text-emerald-700 text-lg">{activeLot.name}</div>
          <p>{activeLot.available} / {activeLot.totalSpaces} spaces</p>
        </div>
      )}

      {/* 📍 RECENTER BUTTON */}
      <button
        onClick={() => {
          setUserInteracted(false);
          if (location) {
            const newCenter = { lat: location.lat, lng: location.lon };
            setMapCenter(newCenter);
            mapRef.current.panTo(newCenter);
          }
        }}
        className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg border hover:bg-gray-100 transition"
      >
        📍
      </button>
    </div>
  );
}
