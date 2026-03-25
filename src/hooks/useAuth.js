
// import { useEffect, useState } from "react";
// import {
//   onAuthStateChanged,
//   signInWithPopup,
//   signInAnonymously,
//   signOut,
// } from "firebase/auth";
// import { ref, get, set, update } from "firebase/database";
// import {
//   auth,
//   db,
//   googleProvider,
//   microsoftProvider,
// } from "../firebaseClient";

// export default function useAuth() {
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [authError, setAuthError] = useState("");
//   const [role, setRole] = useState(null);

//   const saveUserToDatabase = async (firebaseUser) => {
//     if (!firebaseUser || firebaseUser.isAnonymous) return;

//     const userRef = ref(db, `users/${firebaseUser.uid}`);
//     const snap = await get(userRef);

//     if (!snap.exists()) {
//       await set(userRef, {
//         email: firebaseUser.email || "",
//         username: firebaseUser.displayName || "",
//         role: "basic",
//         created_at: new Date().toISOString(),
//         last_login: new Date().toISOString(),
//       });
//     } else {
//       await update(userRef, {
//         email: firebaseUser.email || "",
//         username: firebaseUser.displayName || "",
//         last_login: new Date().toISOString(),
//       });
//     }
//   };

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
//       setAuthLoading(true);
//       setAuthError("");

//       try {
//         setUser(firebaseUser);

//         if (!firebaseUser || firebaseUser.isAnonymous) {
//           setRole(null);
//           setAuthLoading(false);
//           return;
//         }

//         await saveUserToDatabase(firebaseUser);

//         const userRef = ref(db, `users/${firebaseUser.uid}`);
//         const snap = await get(userRef);

//         if (snap.exists()) {
//           const data = snap.val();
//           setRole(data.role || "basic");
//         } else {
//           setRole("basic");
//         }
//       } catch (err) {
//         console.error("Auth state handling failed:", err);
//         setAuthError(err.message || "Authentication failed.");
//         setRole(null);
//       } finally {
//         setAuthLoading(false);
//       }
//     });

//     return () => unsub();
//   }, []);

//   const loginWithGoogle = async () => {
//     setAuthError("");
//     try {
//       return await signInWithPopup(auth, googleProvider);
//     } catch (err) {
//       console.error("Google sign-in failed:", err);
//       setAuthError(err.message || "Google sign-in failed.");
//       throw err;
//     }
//   };

//   const loginWithMicrosoft = async () => {
//     setAuthError("");
//     try {
//       return await signInWithPopup(auth, microsoftProvider);
//     } catch (err) {
//       console.error("Microsoft sign-in failed:", err);
//       setAuthError(err.message || "UNT sign-in failed.");
//       throw err;
//     }
//   };

//   const loginAsGuest = async () => {
//     setAuthError("");
//     try {
//       return await signInAnonymously(auth);
//     } catch (err) {
//       console.error("Guest sign-in failed:", err);
//       setAuthError(err.message || "Guest sign-in failed.");
//       throw err;
//     }
//   };

//   const logout = async () => {
//     setAuthError("");
//     await signOut(auth);
//     setRole(null);
//   };

//   const isAdmin = !!user && !user.isAnonymous && role === "admin";
//   const isBasic = !!user && !user.isAnonymous && role === "basic";
//   const isSignedIn = !!user;

//   return {
//     user,
//     role,
//     authLoading,
//     authError,
//     isSignedIn,
//     isBasic,
//     isAdmin,
//     loginWithGoogle,
//     loginWithMicrosoft,
//     loginAsGuest,
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
import { ref, get, set, update } from "firebase/database";
import {
  auth,
  db,
  googleProvider,
  microsoftProvider,
} from "../firebaseClient";

function getEmail(firebaseUser) {
  return firebaseUser?.email?.toLowerCase().trim() || "";
}

function isApprovedAdminDomain(email) {
  return email.endsWith("@unt.edu") || email.endsWith("@gmail.com");
}

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [role, setRole] = useState(null);

  const saveUserToDatabase = async (firebaseUser) => {
    if (!firebaseUser || firebaseUser.isAnonymous) return;

    const userRef = ref(db, `users/${firebaseUser.uid}`);
    const snap = await get(userRef);

    const userData = {
      email: firebaseUser.email || "",
      username: firebaseUser.displayName || "",
      last_login: new Date().toISOString(),
    };

    if (!snap.exists()) {
      await set(userRef, {
        ...userData,
        role: "basic",
        created_at: new Date().toISOString(),
      });
    } else {
      await update(userRef, userData);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      setAuthError("");

      try {
        setUser(firebaseUser);

        // signed out or guest
        if (!firebaseUser || firebaseUser.isAnonymous) {
          setRole(null);
          return;
        }

        await saveUserToDatabase(firebaseUser);

        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snap = await get(userRef);

        if (snap.exists()) {
          const data = snap.val();
          setRole(data.role || "basic");
        } else {
          setRole("basic");
        }
      } catch (err) {
        console.error("Auth state handling failed:", err);
        setAuthError(err.message || "Authentication failed.");
        setRole(null);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError("");
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setAuthError(err.message || "Google sign-in failed.");
      throw err;
    }
  };

  const loginWithMicrosoft = async () => {
    setAuthError("");
    try {
      return await signInWithPopup(auth, microsoftProvider);
    } catch (err) {
      console.error("Microsoft sign-in failed:", err);
      setAuthError(err.message || "UNT sign-in failed.");
      throw err;
    }
  };

  const loginAsGuest = async () => {
    setAuthError("");
    try {
      return await signInAnonymously(auth);
    } catch (err) {
      console.error("Guest sign-in failed:", err);
      setAuthError(err.message || "Guest sign-in failed.");
      throw err;
    }
  };

  const logout = async () => {
    setAuthError("");
    try {
      await signOut(auth);
      setRole(null);
    } catch (err) {
      console.error("Logout failed:", err);
      setAuthError(err.message || "Logout failed.");
      throw err;
    }
  };

  const email = getEmail(user);

  // real signed-in user only, not guest
  const isSignedIn = !!user && !user.isAnonymous;

  // guests are tracked separately
  const isGuest = !!user && user.isAnonymous;

  // map access
  const canViewMap = isSignedIn;

  // role checks
  const isBasic = isSignedIn && role === "basic";

  // admin must have BOTH:
  // 1. role = admin in database
  // 2. approved domain
  const hasApprovedAdminDomain = isApprovedAdminDomain(email);
  const isAdmin = isSignedIn && role === "admin" && hasApprovedAdminDomain;

  return {
    user,
    role,
    email,
    authLoading,
    authError,

    isSignedIn,
    isGuest,
    isBasic,
    isAdmin,
    canViewMap,
    hasApprovedAdminDomain,

    loginWithGoogle,
    loginWithMicrosoft,
    loginAsGuest,
    logout,
  };
}