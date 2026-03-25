
// import { NavLink } from "react-router-dom";
// import React from "react";
// import useAuth from "../hooks/useAuth";

// export default function Navbar() {
//   const { isAdmin } = useAuth();

//   const links = [
//     { path: "/", label: "Home" },
//     { path: "/map", label: "Map" },
//     { path: "/about", label: "About" },
//     { path: "/contact", label: "Contact" },
//   ];

//   if (isAdmin) {
//     links.push({ path: "/admin", label: "Admin" });
//   }

//   return (
//     <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 border-b border-emerald-100 select-none">
//       <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
//         <NavLink
//           to="/"
//           className="text-2xl font-extrabold text-emerald-700 active:opacity-80 transition"
//         >
//           🅿 Prism Parking
//         </NavLink>

//         <div className="space-x-6 text-lg font-medium flex items-center">
//           {links.map(({ path, label }) => (
//             <NavLink
//               key={path}
//               to={path}
//               draggable="false"
//               className={({ isActive }) =>
//                 `transition active:scale-[0.96] active:opacity-80 ${
//                   isActive
//                     ? "text-emerald-600 font-semibold"
//                     : "text-gray-700 hover:text-emerald-600"
//                 }`
//               }
//             >
//               {label}
//             </NavLink>
//           ))}
//         </div>
//       </div>
//     </nav>
//   );
// }

import { NavLink } from "react-router-dom";
import React from "react";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, isGuest, isAdmin, logout } = useAuth();

  const links = [
    { path: "/", label: "Home" },
    { path: "/map", label: "Map" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  if (isAdmin) {
    links.push({ path: "/admin", label: "Admin" });
  }

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

        {/* Right Side */}
        <div className="flex items-center gap-6">

          {/* Nav Links */}
          <div className="space-x-6 text-lg font-medium">
            {links.map(({ path, label }) => (
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
                {label}
              </NavLink>
            ))}
          </div>

          {/* User Info + Logout */}
          {user && (
            <div className="flex items-center gap-3 ml-4">
              <span className="text-sm text-gray-600">
                {isGuest ? "Guest" : user.email}
              </span>

              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Sign Out
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}