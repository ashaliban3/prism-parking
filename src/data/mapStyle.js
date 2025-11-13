const emeraldMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0d1f18" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d1f18" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#99f6e4" }] },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#1a2f28" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#134e4a" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#082f25" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6ee7b7" }],
  },
];

export default emeraldMapStyle;
