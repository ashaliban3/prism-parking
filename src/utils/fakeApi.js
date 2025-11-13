export const fetchLots = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updated = data.map((lot) => ({
        ...lot,
        available: Math.max(
          0,
          Math.min(
            lot.totalSpaces,
            lot.available + Math.floor(Math.random() * 10 - 5)
          )
        ),
        lastUpdated: Date.now(),
      }));
      resolve(updated);
    }, 600); // simulate network delay
  });
};
