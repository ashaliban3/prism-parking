/* global google */
import { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

export default function GoogleMapComponent({ lots, location }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDWSSFGxGkvtkErzD0HkvER7og8gompwfE",
    version: "weekly",
    libraries: ["places"], // <-- IMPORTANT FIX
  });

  const mapRef = useRef(null);
  const [activeLot, setActiveLot] = useState(null);
  //const [userHovered, setUserHovered] = useState(false);

  const emeraldIconURL = "/icons/emerald-pin.svg";
  const userDotURL = "/icons/user-dot-pulse.svg";

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = mapRef.current;

    if (!map.__markers) map.__markers = [];

    map.__markers.forEach((m) => m.setMap(null));
    map.__markers = [];

    // USER LOCATION
    if (location) {
      const userMarker = new google.maps.Marker({
        map,
        position: { lat: location.lat, lng: location.lon },
        icon: {
          url: userDotURL,
          scaledSize: new google.maps.Size(20, 20),
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
        }
      });

      marker.addListener("mouseover", () => setActiveLot(lot));
      marker.addListener("mouseout", () => setActiveLot(null));
      marker.addListener("click", () => setActiveLot(lot));

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
        center={
          location
            ? { lat: location.lat, lng: location.lon }
            : { lat: 33.2075, lng: -97.1521 }
        }
        zoom={14}
        onLoad={(map) => (mapRef.current = map)}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {activeLot && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-3 rounded-lg shadow-xl border text-sm">
            <div className="font-bold text-emerald-700 text-lg">{activeLot.name}</div>
            <p>{activeLot.available} / {activeLot.totalSpaces} spaces</p>
          </div>
        )}
      </GoogleMap>
    </div>
  );
}
