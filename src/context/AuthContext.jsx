import React, { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import supabase from "../supabase/config";
import { useNavigate } from "react-router";

const AuthContext = React.createContext();

const useAuth = () => useContext(AuthContext);
const AuthProvider = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data) {
        setCurrentUser(data?.session?.user);
      } else {
        setCurrentUser(null);
        navigate("/login");
      }
      setIsAuthLoading(false);
    };

    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setCurrentUser(data?.session?.user);
        } else {
          setCurrentUser(null);
          navigate("/login");
        }
        setIsAuthLoading(false);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const data = {
    currentUser,
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
