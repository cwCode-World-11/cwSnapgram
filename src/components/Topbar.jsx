import { Link } from "react-router";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { logOut } from "../supabase/auth";

const Topbar = () => {
  const { user, setUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await logOut();
      setCurrentUser(null);
      setUser(null);
      navigate("/login");
      toast.success("You were logged out");
    } catch (error) {
      console.log("error:", error);
      toast.error("Failed to logging out!!!");
    }
  };

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/cLogo-removebg.png"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={(e) => handleSignOut(e)}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link
            to={`/profile/${user?.accountId}`}
            className="flex-center gap-3"
          >
            <img
              src={user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
