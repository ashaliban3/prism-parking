import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 border-b border-emerald-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-extrabold text-emerald-700">
          🅿 Prism Parking
        </NavLink>

        {/* Links */}
        <div className="space-x-6 text-lg font-medium">
          {["/", "/map", "/about", "/contact"].map((path, i) => {
            const labels = ["Home", "Map", "About", "Contact"];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "text-emerald-600 font-semibold"
                    : "text-gray-700 hover:text-emerald-600 transition"
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
