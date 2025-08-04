import React, { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import supabase from "../supabase/config";
import { useNavigate } from "react-router";
import { getCurrentUser } from "../supabase/database"; // Custom function to fetch user data

const AuthContext = React.createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // Stores session user
  const [user, setUser] = useState(null); // Stores additional user data

  const navigate = useNavigate();

  // useEffect(() => {
  //   // Listen for auth state changes
  //   const { data: authListener } = supabase.auth.onAuthStateChange(
  //     (_event, session) => {
  //       if (session?.user) {
  //         setCurrentUser(session.user); // Set logged-in user
  //       } else {
  //         setCurrentUser(null); // No user, redirect to login
  //         navigate("/login");
  //       }
  //       setIsAuthLoading(false);
  //     }
  //   );

  //   // Cleanup listener on component unmount
  //   return () => {
  //     authListener.subscription.unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    const checkUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setCurrentUser(session.user); // Set user if session exists
        try {
          const userData = await getCurrentUser(); // Fetch user data from the database
          setUser(userData.data); // Store the user data
          setIsAuthLoading(false); // Stop loading once check is done
        } catch (err) {
          console.log("Error fetching user data:", err);
        }
      } else {
        setCurrentUser(null); // No session, redirect to login
        navigate("/login");
        setIsAuthLoading(false); // Stop loading once check is done
      }
    };

    checkUserSession(); // Run check when the component mounts
  }, []);

  const data = {
    currentUser,
    setCurrentUser,
    user,
    setUser,
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
