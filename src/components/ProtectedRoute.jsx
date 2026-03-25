// import React from "react";
// import useAuth from "../hooks/useAuth";
// import SignIn from "../pages/SignIn";
// import LockedScreen from "./LockedScreen";

// export default function ProtectedRoute({ children }) {
//   const { user, authLoading, isAuthorized, logout } = useAuth();

//   if (authLoading) {
//     return (
//       <div className="min-h-[80vh] flex items-center justify-center">
//         <div className="flex items-center gap-3 text-gray-700">
//           <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
//           <span>Loading PRISM...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <SignIn />;
//   }

//   if (!isAuthorized) {
//     return (
//       <LockedScreen
//         email={user.email}
//         isGuest={user.isAnonymous}
//         onSignOut={logout}
//       />
//     );
//   }

//   return children;
// }

import React from "react";
import useAuth from "../hooks/useAuth";
import SignIn from "../pages/SignIn";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
          <span>Loading PRISM...</span>
        </div>
      </div>
    );
  }

  // blocks guests / anonymous / signed-out users
  if (!user || user.isAnonymous) {
    return <SignIn />;
  }

  return children;
}