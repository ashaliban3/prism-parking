import React from "react";
import {
  HelpCircle,
  Map,
  Navigation,
  Bell,
  Shield,
  AlertCircle,
  Mail,
  MessageSquare,
} from "lucide-react";

export default function Help() {
  const steps = [
    {
      icon: <Map size={22} />,
      title: "View parking lot status",
      text: "Open the Map page to see available parking lots, occupancy information, and current lot status in real time.",
    },
    {
      icon: <Navigation size={22} />,
      title: "Use your location",
      text: "Allow location access so the app can center the map around your position and help you find nearby parking lots more easily.",
    },
    {
      icon: <Bell size={22} />,
      title: "Check live updates",
      text: "Lot information updates as new sensor data is received. Refresh or revisit the map if you do not immediately see changes.",
    },
    {
      icon: <Shield size={22} />,
      title: "Admin features",
      text: "If you have admin access, you can use the Admin page to review system data, monitor activity, and manage parking-related information.",
    },
  ];

  const issues = [
    "Map is not loading",
    "Parking data looks incorrect",
    "Location permission is not working",
    "App is loading slowly",
    "I cannot access the Admin page",
    "A parking lot status has not updated",
  ];

  return (
    <div className="min-h-screen bg-emerald-50 px-6s">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center text-emerald-700">
            <HelpCircle size={44} />
          </div>
          <h1 className="text-4xl font-bold text-emerald-700">Help & Support</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-700">
            Learn how to use Prism Parking and find the best way to report any
            issues you experience while using the app.
          </p>
        </div>

        <div className="mb-10 rounded-2xl bg-white p-8 shadow-md ring-1 ring-emerald-100">
          <h2 className="mb-6 text-2xl font-semibold text-emerald-700">
            How to Use the App
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className="rounded-xl border border-emerald-100 bg-emerald-50 p-5"
              >
                <div className="mb-3 flex items-center gap-3 text-emerald-700">
                  {step.icon}
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
                <p className="text-gray-700">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 rounded-2xl bg-white p-8 shadow-md ring-1 ring-emerald-100">
          <h2 className="mb-6 text-2xl font-semibold text-emerald-700">
            Common Issues
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {issues.map((issue, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-gray-200 p-4"
              >
                <AlertCircle className="mt-0.5 text-emerald-700" size={20} />
                <span className="text-gray-700">{issue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-emerald-100">
          <h2 className="mb-6 text-2xl font-semibold text-emerald-700">
            Report an Issue
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-emerald-50 p-5">
              <div className="mb-3 flex items-center gap-3 text-emerald-700">
                <Mail size={22} />
                <h3 className="text-lg font-semibold">Email Support</h3>
              </div>
              <p className="text-gray-700">
                Contact the support team by email and include details such as the
                issue, what page you were on, and what happened before the problem occurred.
              </p>
              <p className="mt-3 font-medium text-gray-800">
                support@prismparking.com
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-5">
              <div className="mb-3 flex items-center gap-3 text-emerald-700">
                <MessageSquare size={22} />
                <h3 className="text-lg font-semibold">Helpful details to include</h3>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-gray-700">
                <li>What issue you experienced</li>
                <li>What device or browser you were using</li>
                <li>What page you were on</li>
                <li>Whether the issue happens every time</li>
                <li>A screenshot, if available</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-100 p-5 text-gray-800">
            For the fastest help, describe the problem clearly and include as much
            detail as possible.
          </div>
        </div>
      </div>
    </div>
  );
}