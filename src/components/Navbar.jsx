import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 border-b border-emerald-100 select-none">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-extrabold text-emerald-700 active:opacity-80 transition"
        >
          🅿 Prism Parking
        </NavLink>

        {/* Links */}
        <div className="space-x-6 text-lg font-medium flex items-center">
          {["/", "/map", "/about", "/contact"].map((path, i) => {
            const labels = ["Home", "Map", "About", "Contact"];
            return (
              <NavLink
                key={path}
                to={path}
                draggable="false"
                className={({ isActive }) =>
                  `transition active:scale-[0.96] active:opacity-80 ${
                    isActive
                      ? "text-emerald-600 font-semibold"
                      : "text-gray-700 hover:text-emerald-600"
                  }`
                }
              >
                {labels[i]}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
