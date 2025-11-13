export const getStatus = (available, total) => {
  if (available === 0) return "full";
  const ratio = available / total;
  if (ratio > 0.6) return "high";
  if (ratio > 0.3) return "medium";
  return "low";
};

export const statusColors = {
  high: "bg-emerald-100 text-emerald-700 border-emerald-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  low: "bg-red-100 text-red-700 border-red-300",
  full: "bg-gray-200 text-gray-500 border-gray-300",
};
