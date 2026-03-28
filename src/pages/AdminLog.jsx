import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebaseClient";

export default function Admin() {
  const [lots, setLots] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingLots, setLoadingLots] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const lotsRef = ref(db, "lots");
    const eventsRef = ref(db, "events");

    const unsubscribeLots = onValue(lotsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setLots([]);
        setLoadingLots(false);
        return;
      }

      const parsedLots = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));

      setLots(parsedLots);
      setLoadingLots(false);
    });

    const unsubscribeEvents = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setEvents([]);
        setLoadingEvents(false);
        return;
      }

      const parsedEvents = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));

      parsedEvents.sort((a, b) => {
        const aTime = new Date(a.timestamp || 0).getTime();
        const bTime = new Date(b.timestamp || 0).getTime();
        return bTime - aTime;
      });

      setEvents(parsedEvents);
      setLoadingEvents(false);
    });

    return () => {
      off(lotsRef);
      off(eventsRef);
    };
  }, []);

  const getStatusColor = (lot) => {
    const current = Number(lot.currentOccupancy || 0);
    const total = Number(lot.totalCapacity || 0);

    if (total <= 0) return "text-gray-600";

    const ratio = current / total;

    if (ratio >= 1) return "text-red-600";
    if (ratio >= 0.85) return "text-orange-500";
    return "text-green-600";
  };

  const getStatusLabel = (lot) => {
    const current = Number(lot.currentOccupancy || 0);
    const total = Number(lot.totalCapacity || 0);

    if (total <= 0) return "Unknown";
    if (current >= total) return "Full";
    if (current / total >= 0.85) return "Almost Full";
    return "Available";
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-3 text-lg text-slate-600">
            Monitor multiple lots, view occupancy, and historical data.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">
            Live Lot Overview
          </h2>

          {loadingLots ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
              Loading lot data...
            </div>
          ) : lots.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
              No lot data found.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {lots.map((lot) => {
                const current = Number(lot.currentOccupancy || 0);
                const total = Number(lot.totalCapacity || 0);
                const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0;

                return (
                  <div
                    key={lot.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-slate-900">
                        {lot.name || lot.id}
                      </h3>
                      <span className={`font-semibold ${getStatusColor(lot)}`}>
                        {getStatusLabel(lot)}
                      </span>
                    </div>

                    <div className="mb-3 text-3xl font-bold text-slate-900">
                      {current}
                      <span className="ml-2 text-lg font-medium text-slate-500">
                        / {total || "?"}
                      </span>
                    </div>

                    <div className="mb-4 text-sm text-slate-600">
                      Current Occupancy
                    </div>

                    <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="text-sm text-slate-600">
                      {percent.toFixed(0)}% full
                    </div>

                    <div className="mt-4 text-sm text-slate-500">
                      Last update:{" "}
                      {lot.lastUpdate
                        ? new Date(lot.lastUpdate).toLocaleString()
                        : "Unknown"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">
            Recent Event History
          </h2>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Lot
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Event
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingEvents ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                      Loading event history...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                      No event history found.
                    </td>
                  </tr>
                ) : (
                  events.slice(0, 25).map((event) => (
                    <tr key={event.id} className="border-t border-slate-200">
                      <td className="px-6 py-4 text-slate-700">
                        {event.timestamp
                          ? new Date(event.timestamp).toLocaleString()
                          : "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {event.lotID || event.lotId || "—"}
                      </td>
                      <td
                        className={`px-6 py-4 font-semibold ${
                          event.eventType === "ENTRY"
                            ? "text-green-600"
                            : event.eventType === "EXIT"
                            ? "text-red-600"
                            : "text-slate-700"
                        }`}
                      >
                        {event.eventType || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}