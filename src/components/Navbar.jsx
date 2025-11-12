import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold text-blue-600">🅿 Prism</div>
          <div className="text-sm text-gray-600">Parking</div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "text-sm font-medium " + (isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600")
            }
            aria-current="page"
          >
            Home
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) =>
              "text-sm font-medium " + (isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600")
            }
          >
            Map
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              "text-sm font-medium " + (isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600")
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              "text-sm font-medium " + (isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600")
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Mobile menu: very simple toggle (keeps it tiny) */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

/* Minimal mobile menu component */
function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle menu"
        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white shadow-md rounded border border-gray-100">
          <NavLink onClick={() => setOpen(false)} to="/" end className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Home</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/map" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Map</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">About</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Contact</NavLink>
        </div>
      )}
    </div>
  );
}
