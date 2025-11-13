/* global google */
import { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import emeraldMapStyle from "../data/mapStyle";

export default function GoogleMapComponent({ lots, location }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDWSSFGxGkvtkErzD0HkvER7og8gompwfE",
    version: "beta", // Required for AdvancedMarkerElement
    libraries: ["marker"],
});

  const mapRef = useRef(null);

  const [activeLot, setActiveLot] = useState(null);
  const [userHovered, setUserHovered] = useState(false);

  // Use icons stored in /public/icons/
  const emeraldIconURL = "/public/icons/emerald-pin.svg";
  const userDotURL = "/public/icons/user-dot-pulse.svg";

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = mapRef.current;

    // Remove old markers before adding new ones
    map.__markers?.forEach((m) => (m.map = null));
    map.__markers = [];

    // ---- USER LOCATION MARKER ----
    if (location) {
      const userImg = document.createElement("img");
      userImg.src = userDotURL;
      userImg.style.width = "14px";
      userImg.style.cursor = "pointer";

      const userMarker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: location.lat, lng: location.lon },
        content: userImg,
      });

      userImg.addEventListener("mouseenter", () => setUserHovered(true));
      userImg.addEventListener("mouseleave", () => setUserHovered(false));

      map.__markers.push(userMarker);
    }

    // ---- PARKING LOT MARKERS ----
    lots.forEach((lot) => {
      const pin = document.createElement("img");
      pin.src = emeraldIconURL;
      pin.style.width = "40px";
      pin.style.cursor = "pointer";

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: lot.lat, lng: lot.lon },
        content: pin,
      });

      pin.addEventListener("mouseenter", () => setActiveLot(lot));
      pin.addEventListener("mouseleave", () => setActiveLot(null));
      pin.addEventListener("click", () => setActiveLot(lot));

      map.__markers.push(marker);
    });
  }, [isLoaded, lots, location]);

  if (!isLoaded) return <p>Loading map...</p>;

  const defaultCenter = { lat: 33.2075, lng: -97.1521 };

  return (
    <div className="relative">

      {/* Re-center Button */}
      <button
        onClick={() => {
          if (location && mapRef.current) {
            mapRef.current.panTo({ lat: location.lat, lng: location.lon });
            mapRef.current.setZoom(15);
          }
        }}
        className="absolute z-50 top-3 right-3 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-700"
      >
        Center on Me
      </button>

      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "400px",
          borderRadius: "12px",
        }}
        center={location ? { lat: location.lat, lng: location.lon } : defaultCenter}
        zoom={14}
        onLoad={(map) => (mapRef.current = map)}
        options={{
          styles: emeraldMapStyle,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {/* Bottom floating popups */}
        {activeLot && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-3 rounded-lg shadow-xl border border-gray-200 text-sm">
            <div className="font-bold text-emerald-700 text-lg">{activeLot.name}</div>

            <p className="text-gray-600 text-sm">
              {activeLot.available} / {activeLot.totalSpaces} spaces
            </p>

            <p className="text-xs text-gray-400 mb-2">
              Updated: {new Date(activeLot.lastUpdated).toLocaleTimeString()}
            </p>

            <button
              className="mt-2 w-full bg-emerald-600 text-white py-1 rounded hover:bg-emerald-700"
              onClick={() => alert(`Reserved at ${activeLot.name}`)}
            >
              Reserve Spot
            </button>
          </div>
        )}

        {userHovered && location && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-md border text-sm">
            📍 <strong>Your Location</strong>
          </div>
        )}
      </GoogleMap>
    </div>
  );
}
