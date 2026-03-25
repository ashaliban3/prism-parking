// import React from "react";
// import useAuth from "../hooks/useAuth";
// import SignIn from "../pages/SignIn";

// export default function AdminRoute({ children }) {
//   const { user, authLoading, isAuthorized } = useAuth();

//   if (authLoading) {
//     return <div className="p-8">Loading...</div>;
//   }

//   if (!user) {
//     return <SignIn />;
//   }

//   if (!isAuthorized) {
//     return (
//       <div className="min-h-[80vh] flex items-center justify-center px-4">
//         <div className="bg-white border shadow rounded-2xl p-8 max-w-lg text-center">
//           <h1 className="text-3xl font-bold mb-3">Access Restricted</h1>
//           <p className="text-gray-600">
//             You do not have permission to view the admin page.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return children;
// }

import React from "react";
import useAuth from "../hooks/useAuth";
import SignIn from "../pages/SignIn";

export default function AdminRoute({ children }) {
  const { user, authLoading, role } = useAuth();

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

  if (!user || user.isAnonymous) {
    return <SignIn />;
  }

  const email = user.email?.toLowerCase() || "";
  const isApprovedAdminDomain =
    email.endsWith("@unt.edu") || email.endsWith("@gmail.com");

  const isAdmin = role === "admin" && isApprovedAdminDomain;

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white border shadow rounded-2xl p-8 max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-3">Access Restricted</h1>
          <p className="text-gray-600 mb-2">
            Admin access requires:
          </p>
          <ul className="text-sm text-gray-600 text-left list-disc pl-5">
            <li>a signed-in account</li>
            <li>role set to <strong>admin</strong></li>
            <li>a <strong>@unt.edu</strong> or <strong>@gmail.com</strong> email</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Current email: <strong>{user.email || "none"}</strong>
          </p>
          <p className="text-gray-700">
            Current role: <strong>{role || "none"}</strong>
          </p>
        </div>
      </div>
    );
  }

  return children;
}