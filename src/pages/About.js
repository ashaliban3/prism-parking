import React from "react";

export default function About() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">About Prism Parking</h1>
      <p className="text-gray-600 max-w-prose">
        Prism Parking is a prototype that helps users find nearby parking. This
        demo app shows UI and interactions using React + Tailwind. No backend yet —
        parking data is simulated for the prototype.
      </p>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold">Vision</h2>
        <p className="text-gray-600 mt-2">
          Provide fast, visual parking availability and simple reservations. Later
          we will add real-time feeds, maps, and user accounts.
        </p>
      </section>
    </div>
  );
}
