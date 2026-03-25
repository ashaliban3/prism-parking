import React from "react";

export default function AdminLog() {
  const mockLogs = [
    {
      id: 1,
      timestamp: "3/19/2026, 3:19:19 PM",
      event: "EXIT",
      source: "RASPBERRY_PI5",
    },
    {
      id: 2,
      timestamp: "3/19/2026, 3:19:17 PM",
      event: "ENTRY",
      source: "RASPBERRY_PI5",
    },
    {
      id: 3,
      timestamp: "3/19/2026, 3:19:12 PM",
      event: "ENTRY",
      source: "RASPBERRY_PI5",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Event Log</h1>
      <p className="text-gray-600 mb-8">
        Entry and exit activity for authorized admin users.
      </p>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b bg-gray-50 font-semibold text-gray-700">
          <div>Timestamp</div>
          <div>Event</div>
          <div>Source</div>
        </div>

        {mockLogs.map((log) => (
          <div
            key={log.id}
            className="grid grid-cols-3 gap-4 px-6 py-4 border-b last:border-b-0"
          >
            <div className="text-gray-700">{log.timestamp}</div>
            <div
              className={`font-semibold ${
                log.event === "ENTRY" ? "text-green-600" : "text-red-600"
              }`}
            >
              {log.event}
            </div>
            <div className="text-gray-700">{log.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}