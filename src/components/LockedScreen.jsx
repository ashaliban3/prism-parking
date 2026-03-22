// import React from "react";

// export default function LockedScreen({ email, onSignOut }) {
//   return (
//     <div className="min-h-[80vh] flex items-center justify-center px-4">
//       <div className="bg-white border shadow-xl rounded-2xl p-10 max-w-lg w-full text-center">
//         <div className="text-7xl mb-4">🔒</div>
//         <h2 className="text-2xl font-bold text-gray-900">Access Restricted</h2>
//         <p className="text-gray-600 mt-3">
//           This account does not have permission to view protected PRISM parking data.
//         </p>
//         {email && (
//           <p className="text-sm text-gray-500 mt-2">
//             Signed in as: {email}
//           </p>
//         )}

//         <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
//           Guests and unauthorized users can access only the locked view.
//         </div>

//         <button
//           onClick={onSignOut}
//           className="mt-6 px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
//         >
//           Sign Out
//         </button>
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function LockedScreen({ email, isGuest, onSignOut }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-lg text-center border">
        <div className="text-6xl mb-4">🔒</div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Access Restricted
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          {isGuest
            ? "Guest mode can view only the locked screen."
            : "This account does not have permission to view protected PRISM parking data."}
        </p>

        {email && !isGuest && (
          <p className="text-sm text-gray-500 mb-6">{email}</p>
        )}

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-6">
          Guests and unauthorized users can access only the locked view.
        </div>

        <button
          onClick={onSignOut}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}