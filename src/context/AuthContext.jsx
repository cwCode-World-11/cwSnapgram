import { createContext, useContext, useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import supabase from "../supabase/config";
import { useNavigate, useLocation } from "react-router";
import { getCurrentUser } from "../supabase/database"; // Custom function to fetch user data

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(); // Stores additional user data
  const [currentUser, setCurrentUser] = useState(); // Stores session user
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // this ref marks that we're in a password-recovery flow
  const recoveryRef = useRef(false);

  useEffect(() => {
    setIsAuthLoading(true);
    const checkUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setCurrentUser(session.user); // Set user if session exists
        try {
          const userData = await getCurrentUser(); // Fetch user data from the database
          if (!userData.data) {
            return;
          }
          setUser(userData.data); // Store the user data
          if (["/login", "/sign-up", "/forget-password"].includes(pathname)) {
            navigate("/");
          }
        } catch (err) {
          console.log("Error fetching user data:", err);
        } finally {
          setIsAuthLoading(false); // Stop loading once check is done
        }
      } else {
        navigate("/login");
        setUser(null);
        setCurrentUser(null); // No session, redirect to login
        setIsAuthLoading(false); // Stop loading once check is done
      }
    };

    checkUserSession(); // Run check when the component mounts
  }, []);

  useEffect(() => {
    if (!["/login", "/sign-up", "/forget-password"].includes(pathname)) {
      if (!isAuthLoading) {
        if (!currentUser && !user) {
          navigate("/login");
        }
      }
    }
  }, [pathname, currentUser, user]);

  // NOTE: don't delete this
  // useEffect(() => {
  //   let mounted = true;
  //   let unsubscribeFn = null;

  //   // A helper function to fetch and set user data
  //   const checkAndSetUser = async (session) => {
  //     if (!mounted) return;

  //     if (session) {
  //       setCurrentUser(session.user);
  //       try {
  //         const userData = await getCurrentUser();
  //         console.log("userData:", userData);
  //         console.log("bbbbbbbbbbbbb");
  //         if (userData?.data) setUser(userData.data);
  //       } catch (err) {
  //         console.error("Error fetching user data:", err);
  //       }
  //     } else {
  //       setCurrentUser(null);
  //       setUser(null);
  //     }

  //     if (mounted) setIsAuthLoading(false);
  //   };

  //   // The main event handler for auth state changes
  //   const handleRedirect = async (event, session) => {
  //     // Check for recovery marker
  //     const isRecovery =
  //       recoveryRef.current || !!localStorage.getItem("supabase:pw_recovery");

  //     console.log(
  //       `[AuthProvider] onAuthStateChange event: ${event}, session: ${!!session}, isRecovery: ${isRecovery}`
  //     );

  //     if (event === "SIGNED_IN") {
  //       await checkAndSetUser(session);
  //       console.log("aaaaaaaaaaaaaaaa");

  //       if (isRecovery) {
  //         console.log(
  //           "[AuthProvider] SIGNED_IN event during recovery. Navigating to /update-user."
  //         );
  //         // Only navigate if we are not already on the correct page
  //         if (pathname !== "/update-user") {
  //           navigate("/update-user");
  //         }
  //       } else {
  //         console.log("[AuthProvider] SIGNED_IN event. Navigating to home.");
  //         if (
  //           pathname === "/login" ||
  //           pathname === "/sign-up" ||
  //           pathname === "/forget-password"
  //         ) {
  //           navigate("/");
  //         }
  //       }
  //       // Clean up the recovery marker after successful sign in or routing
  //       if (isRecovery) {
  //         setTimeout(() => {
  //           localStorage.removeItem("supabase:pw_recovery");
  //           recoveryRef.current = false;
  //           console.log("[AuthProvider] Recovery marker removed.");
  //         }, 1000); // Give the UI a moment to load
  //       }
  //     } else if (event === "SIGNED_OUT") {
  //       await checkAndSetUser(null);
  //       console.log("[AuthProvider] SIGNED_OUT event. Navigating to /login.");
  //       if (pathname !== "/login") {
  //         navigate("/login");
  //       }
  //     } else if (event === "PASSWORD_RECOVERY") {
  //       console.log(
  //         "[AuthProvider] PASSWORD_RECOVERY event. Marking recovery and navigating."
  //       );
  //       // Mark the state
  //       localStorage.setItem("supabase:pw_recovery", "1");
  //       recoveryRef.current = true;
  //       // await checkAndSetUser(session);
  //       if (pathname !== "/update-user") {
  //         navigate("/update-user");
  //       }
  //     } else {
  //       // For other events, just update the user state without a redirect
  //       await checkAndSetUser(session);
  //     }
  //   };

  //   // 1. Initial check on mount
  //   const checkInitialSession = async () => {
  //     setIsAuthLoading(true);
  //     const rawHash = window.location.hash.replace(/^#/, "");
  //     const rawSearch = window.location.search.replace(/^\?/, "");

  //     // Check for recovery markers synchronously
  //     const searchParams = new URLSearchParams(rawSearch);
  //     if (
  //       searchParams.get("action") === "reset" ||
  //       rawHash.includes("type=recovery")
  //     ) {
  //       console.log("[AuthProvider] Initial load: recovery marker detected.");
  //       recoveryRef.current = true;
  //       localStorage.setItem("supabase:pw_recovery", "1");
  //     }

  //     // Check for an existing session. Supabase handles the token exchange from URL.
  //     const { data, error } = await supabase.auth.getSession();
  //     if (error) {
  //       console.warn("[AuthProvider] Initial getSession error:", error);
  //     }

  //     await checkAndSetUser(data?.session);

  //     // Handle the initial redirect based on the session and recovery status
  //     if (data?.session) {
  //       if (recoveryRef.current) {
  //         console.log(
  //           "[AuthProvider] Initial load: Session found, is recovery. Navigating to /update-user."
  //         );
  //         if (pathname !== "/update-user") {
  //           navigate("/update-user");
  //         }
  //       } else {
  //         console.log(
  //           "[AuthProvider] Initial load: Session found, not recovery. Navigating to /."
  //         );
  //         if (["/login", "/sign-up", "/forget-password"].includes(pathname)) {
  //           navigate("/");
  //         }
  //       }
  //     } else {
  //       // No session found
  //       if (recoveryRef.current) {
  //         console.log(
  //           "[AuthProvider] Initial load: No session, but is recovery. Stay on /update-user."
  //         );
  //       } else {
  //         console.log(
  //           "[AuthProvider] Initial load: No session, not recovery. Navigating to /login."
  //         );
  //         if (
  //           !["/sign-up", "/forget-password", "/update-user"].includes(pathname)
  //         ) {
  //           navigate("/login");
  //         }
  //       }
  //     }
  //   };

  //   checkInitialSession();

  //   // 2. Subscribe to future changes
  //   const { data } = supabase.auth.onAuthStateChange(handleRedirect);
  //   unsubscribeFn = data?.subscription;

  //   return () => {
  //     mounted = false;
  //     try {
  //       unsubscribeFn?.unsubscribe();
  //     } catch (err) {
  //       console.warn("unsubscribe error", err);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const exceptPath = [
  //     "/login",
  //     "/update-user",
  //     "/sign-up",
  //     "/forget-password",
  //   ];
  //   if (!exceptPath.includes(pathname) && !user) {
  //     console.log("i am in seprate useEffect");
  //     navigate("/login");
  //   }
  // }, [user]);

  const data = {
    currentUser,
    setCurrentUser,
    user,
    setUser,
    isAuthLoading,
  };

  return (
    <AuthContext.Provider value={data}>
      {isAuthLoading ? (
        <div className="flex items-center justify-center w-screen h-screen">
          <Loader size={64} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export { useAuth };

export default AuthProvider;
