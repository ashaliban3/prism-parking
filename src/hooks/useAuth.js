// import { useEffect, useState } from "react";
// import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
// import { ref, get, set } from "firebase/database";
// import { auth, db, googleProvider, microsoftProvider } from "../firebaseClient";

// export default function useAuth() {
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [authError, setAuthError] = useState("");

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
//       setAuthLoading(true);
//       setAuthError("");

//       try {
//         if (!firebaseUser) {
//           setUser(null);
//           setIsAuthorized(false);
//           setAuthLoading(false);
//           return;
//         }

//         setUser(firebaseUser);

//         await set(ref(db, `users/${firebaseUser.uid}`), {
//           username: firebaseUser.displayName || "",
//           email: firebaseUser.email || "",
//           last_login: new Date().toISOString(),
//         });

//         const roleSnap = await get(ref(db, `users/${firebaseUser.uid}/role`));
//         const approvedSnap = await get(ref(db, `users/${firebaseUser.uid}/approved`));

//         const role = roleSnap.exists() ? roleSnap.val() : "guest";
//         const approved = approvedSnap.exists() ? approvedSnap.val() : false;

//         setIsAuthorized(role === "admin" || role === "viewer" || approved === true);
//       } catch (err) {
//         console.error("Auth state check failed:", err);
//         setAuthError("Unable to verify account access.");
//         setIsAuthorized(false);
//       } finally {
//         setAuthLoading(false);
//       }
//     });

//     return () => unsub();
//   }, []);

//   const loginWithGoogle = async () => {
//     setAuthError("");
//     await signInWithPopup(auth, googleProvider);
//   };

//   const loginWithMicrosoft = async () => {
//     setAuthError("");
//     await signInWithPopup(auth, microsoftProvider);
//   };

//   const logout = async () => {
//     await signOut(auth);
//   };

//   return {
//     user,
//     authLoading,
//     isAuthorized,
//     authError,
//     loginWithGoogle,
//     loginWithMicrosoft,
//     logout,
//   };
// }

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { ref, get, set, update} from "firebase/database";
import {
  auth,
  db,
  googleProvider,
  microsoftProvider,
} from "../firebaseClient";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const saveUserToDatabase = async (firebaseUser) => {
  if (!firebaseUser || firebaseUser.isAnonymous) return;

  const userRef = ref(db, `users/${firebaseUser.uid}`);
  const snap = await get(userRef);

  if (!snap.exists()) {
    await set(userRef, {
      email: firebaseUser.email || "",
      username: firebaseUser.displayName || "",
      role: "basic",
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    });
  } else {
    await update(userRef, {
      email: firebaseUser.email || "",
      username: firebaseUser.displayName || "",
      last_login: new Date().toISOString(),
    });
  }
};

  const loginWithGoogle = async () => {
    setAuthError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToDatabase(result.user);
      return result;
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setAuthError(err.message || "Google sign-in failed.");
      throw err;
    }
  };

  const loginWithMicrosoft = async () => {
    setAuthError("");
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      await saveUserToDatabase(result.user);
      return result;
    } catch (err) {
      console.error("Microsoft sign-in failed:", err);
      setAuthError(err.message || "UNT sign-in failed.");
      throw err;
    }
  };

  const loginAsGuest = async () => {
    setAuthError("");
    try {
      const result = await signInAnonymously(auth);
      return result;
    } catch (err) {
      console.error("Guest sign-in failed:", err);
      setAuthError(err.message || "Guest sign-in failed.");
      throw err;
    }
  };

  const logout = async () => {
    setAuthError("");
    await signOut(auth);
  };

  const isAuthorized =
    !!user &&
    !user.isAnonymous &&
    user.email?.endsWith("@unt.edu");

  return {
    user,
    authLoading,
    authError,
    isAuthorized,
    loginWithGoogle,
    loginWithMicrosoft,
    loginAsGuest,
    logout,
  };
}