import React, { useEffect, useState } from "react";

export default function Home() {
  const [demoData, setDemoData] = useState(null);

  useEffect(() => {
    // example of fetching (demo only) — replace with real API later
    const fetchDemo = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
        const json = await res.json();
        setDemoData(json);
      } catch (err) {
        setDemoData({ error: "Failed to fetch demo data" });
      }
    };
    fetchDemo();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Home</h2>
      <p className="mb-4">Welcome — this is the skeleton app for Prism Parking.</p>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Demo fetch (useEffect example)</h3>
        <pre className="mt-2 text-sm bg-gray-100 p-3 rounded">
          {demoData ? JSON.stringify(demoData, null, 2) : "Loading..."}
        </pre>
      </section>
    </div>
  );
}

