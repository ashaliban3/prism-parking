
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
  return email.endsWith("@unt.edu") || email.endsWith("@gmail.com") || email.endsWith("@my.unt.edu");
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

// import { useEffect, useState } from "react";
// import { Capacitor } from "@capacitor/core";
// import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
// import { ref, get, set, update } from "firebase/database";
// import { db } from "../firebaseClient";

// function getEmail(user) {
//   return user?.email?.toLowerCase().trim() || "";
// }

// function isApprovedAdminDomain(email) {
//   return (
//     email.endsWith("@unt.edu") ||
//     email.endsWith("@gmail.com") ||
//     email.endsWith("@my.unt.edu")
//   );
// }

// export default function useAuth() {
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [authError, setAuthError] = useState("");
//   const [role, setRole] = useState(null);

//   const saveUserToDatabase = async (firebaseUser) => {
//     if (!firebaseUser || firebaseUser.isAnonymous) return;

//     const userRef = ref(db, `users/${firebaseUser.uid}`);
//     const snap = await get(userRef);

//     const userData = {
//       email: firebaseUser.email || "",
//       username: firebaseUser.displayName || "",
//       last_login: new Date().toISOString(),
//     };

//     if (!snap.exists()) {
//       await set(userRef, {
//         ...userData,
//         role: "basic",
//         created_at: new Date().toISOString(),
//       });
//     } else {
//       await update(userRef, userData);
//     }
//   };

//   useEffect(() => {
//     let handle = null;

//     const attachListener = async () => {
//       try {
//         // Pull current user once on startup
//         const result = await FirebaseAuthentication.getCurrentUser();
//         const currentUser = result?.user ?? null;
//         setUser(currentUser);

//         if (!currentUser || currentUser.isAnonymous) {
//           setRole(null);
//         } else {
//           await saveUserToDatabase(currentUser);

//           const userRef = ref(db, `users/${currentUser.uid}`);
//           const snap = await get(userRef);
//           setRole(snap.exists() ? (snap.val().role || "basic") : "basic");
//         }
//       } catch (err) {
//         console.error("Initial auth load failed:", err);
//         setAuthError(err?.message || "Authentication failed.");
//         setUser(null);
//         setRole(null);
//       } finally {
//         setAuthLoading(false);
//       }

//       handle = await FirebaseAuthentication.addListener(
//         "authStateChange",
//         async ({ user: firebaseUser }) => {
//           setAuthLoading(true);
//           setAuthError("");

//           try {
//             setUser(firebaseUser ?? null);

//             if (!firebaseUser || firebaseUser.isAnonymous) {
//               setRole(null);
//               return;
//             }

//             await saveUserToDatabase(firebaseUser);

//             const userRef = ref(db, `users/${firebaseUser.uid}`);
//             const snap = await get(userRef);

//             if (snap.exists()) {
//               const data = snap.val();
//               setRole(data.role || "basic");
//             } else {
//               setRole("basic");
//             }
//           } catch (err) {
//             console.error("Auth state handling failed:", err);
//             setAuthError(err?.message || "Authentication failed.");
//             setRole(null);
//           } finally {
//             setAuthLoading(false);
//           }
//         }
//       );
//     };

//     attachListener();

//     return () => {
//       if (handle && typeof handle.remove === "function") {
//         handle.remove();
//       }
//     };
//   }, []);

//   const loginWithGoogle = async () => {
//     setAuthError("");
//     try {
//       if (Capacitor.isNativePlatform()) {
//         const result = await FirebaseAuthentication.signInWithGoogle();
//         return result;
//       }

//       const result = await FirebaseAuthentication.signInWithGoogle({
//         mode: "popup",
//       });
//       return result;
//     } catch (err) {
//       console.error("Google sign-in failed:", err);
//       setAuthError(err?.message || "Google sign-in failed.");
//       throw err;
//     }
//   };

//   const loginWithMicrosoft = async () => {
//     setAuthError("");
//     try {
//       if (Capacitor.isNativePlatform()) {
//         const result = await FirebaseAuthentication.signInWithMicrosoft({
//           scopes: ["email", "openid", "profile"],
//           customParameters: [
//             { key: "prompt", value: "select_account" },
//             { key: "tenant", value: "70de1992-07c6-480f-a318-a1afcba03983" },
//           ],
//         });
//         return result;
//       }

//       const result = await FirebaseAuthentication.signInWithMicrosoft({
//         mode: "popup",
//         scopes: ["email", "openid", "profile"],
//         customParameters: [
//           { key: "prompt", value: "select_account" },
//           { key: "tenant", value: "70de1992-07c6-480f-a318-a1afcba03983" },
//         ],
//       });
//       return result;
//     } catch (err) {
//       console.error("Microsoft sign-in failed:", err);
//       setAuthError(err?.message || "UNT sign-in failed.");
//       throw err;
//     }
//   };

//   const loginAsGuest = async () => {
//     setAuthError("");
//     try {
//       return await FirebaseAuthentication.signInAnonymously();
//     } catch (err) {
//       console.error("Guest sign-in failed:", err);
//       setAuthError(err?.message || "Guest sign-in failed.");
//       throw err;
//     }
//   };

//   const logout = async () => {
//     setAuthError("");
//     try {
//       await FirebaseAuthentication.signOut();
//       setUser(null);
//       setRole(null);
//     } catch (err) {
//       console.error("Logout failed:", err);
//       setAuthError(err?.message || "Logout failed.");
//       throw err;
//     }
//   };

//   const email = getEmail(user);
//   const isSignedIn = !!user && !user.isAnonymous;
//   const isGuest = !!user && user.isAnonymous;
//   const canViewMap = isSignedIn;
//   const isBasic = isSignedIn && role === "basic";
//   const hasApprovedAdminDomain = isApprovedAdminDomain(email);
//   const isAdmin = isSignedIn && role === "admin" && hasApprovedAdminDomain;

//   return {
//     user,
//     role,
//     email,
//     authLoading,
//     authError,

//     isSignedIn,
//     isGuest,
//     isBasic,
//     isAdmin,
//     canViewMap,
//     hasApprovedAdminDomain,

//     loginWithGoogle,
//     loginWithMicrosoft,
//     loginAsGuest,
//     logout,
//   };
// }