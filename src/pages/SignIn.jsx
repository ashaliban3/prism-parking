// import React, { useState } from "react";
// import useAuth from "../hooks/useAuth";

// export default function SignIn() {
//   const {
//     authLoading,
//     authError,
//     loginWithGoogle,
//     loginWithMicrosoft,
//   } = useAuth();

//   const [busy, setBusy] = useState("");

//   const handleGoogle = async () => {
//     try {
//       setBusy("google");
//       await loginWithGoogle();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setBusy("");
//     }
//   };

//   const handleMicrosoft = async () => {
//     try {
//       setBusy("microsoft");
//       await loginWithMicrosoft();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setBusy("");
//     }
//   };

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center px-4">
//       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center border">
//         <h1 className="text-3xl font-bold text-gray-900">PRISM</h1>
//         <p className="text-sm text-gray-500 mt-2 mb-8">
//           Sign in to access protected parking data
//         </p>

//         <button
//           onClick={handleGoogle}
//           disabled={authLoading || busy !== ""}
//           className="w-full bg-blue-600 text-white py-3 rounded-lg mb-3 hover:bg-blue-700 disabled:opacity-60"
//         >
//           {busy === "google" ? "Connecting..." : "Sign in with Google"}
//         </button>

//         <button
//           onClick={handleMicrosoft}
//           disabled={authLoading || busy !== ""}
//           className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-black disabled:opacity-60"
//         >
//           {busy === "microsoft" ? "Connecting..." : "Sign in with UNT Email"}
//         </button>

//         {(authLoading || busy) && (
//           <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-600">
//             <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
//             <span>Authenticating...</span>
//           </div>
//         )}

//         {authError && (
//           <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
//             {authError}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function SignIn() {
  const {
    authLoading,
    authError,
    loginWithGoogle,
    loginWithMicrosoft,
    loginAsGuest,
  } = useAuth();

  const [busy, setBusy] = useState("");

  const handleGoogle = async () => {
    try {
      setBusy("google");
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setBusy("");
    }
  };

  const handleMicrosoft = async () => {
    try {
      setBusy("microsoft");
      await loginWithMicrosoft();
    } catch (err) {
      console.error(err);
    } finally {
      setBusy("");
    }
  };

  const handleGuest = async () => {
    try {
      setBusy("guest");
      await loginAsGuest();
    } catch (err) {
      console.error(err);
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center border">
        <h1 className="text-3xl font-bold text-gray-900">PRISM</h1>
        <p className="text-sm text-gray-500 mt-2 mb-8">
          Sign in to access protected parking data
        </p>

        <button
          onClick={handleGoogle}
          disabled={authLoading || busy !== ""}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mb-3 hover:bg-blue-700 disabled:opacity-60"
        >
          {busy === "google" ? "Connecting..." : "Sign in with Google"}
        </button>

        <button
          onClick={handleMicrosoft}
          disabled={authLoading || busy !== ""}
          className="w-full bg-gray-900 text-white py-3 rounded-lg mb-3 hover:bg-black disabled:opacity-60"
        >
          {busy === "microsoft" ? "Connecting..." : "Sign in with UNT Email"}
        </button>

        <button
          onClick={handleGuest}
          disabled={authLoading || busy !== ""}
          className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-60"
        >
          {busy === "guest" ? "Entering guest mode..." : "Continue as Guest"}
        </button>

        {(authLoading || busy) && (
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
            <span>Authenticating...</span>
          </div>
        )}

        {authError && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {authError}
          </div>
        )}
      </div>
    </div>
  );
}