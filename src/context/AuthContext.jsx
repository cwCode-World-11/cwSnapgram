import React, { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import supabase from "../supabase/config";
import { useNavigate } from "react-router";
import { getCurrentUser } from "../supabase/database"; // Custom function to fetch user data

const AuthContext = React.createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(); // Stores additional user data
  const [currentUser, setCurrentUser] = useState(); // Stores session user
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const navigate = useNavigate();

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
          setUser(userData.data); // Store the user data
          navigate("/");
        } catch (err) {
          console.log("Error fetching user data:", err);
        } finally {
          setIsAuthLoading(false); // Stop loading once check is done
        }
      } else {
        navigate("/login");
        setCurrentUser(null); // No session, redirect to login
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
