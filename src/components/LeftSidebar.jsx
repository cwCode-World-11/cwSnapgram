import {
  Link,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router";
import { Button } from "./ui/button";
import { sidebarLinks } from "../lib/constants";
import { logOut } from "../supabase/auth";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LeftSidebar = () => {
  const { user, setUser, setCurrentUser, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // useEffect(() => {
  //   if (!user) {
  //     window.location.reload();
  //   }
  // }, []);

  if (!isAuthLoading && !user) {
    return (
      <>
        <p>Leftsidebar no user and no auth loading so navigating to login</p>
        <Navigate to="/login" />
      </>
    );
    // return (
    //   <div className="w-screen h-screen flex-center items-center">
    //     user not found!!!
    //     <p>reload the page</p>
    //   </div>
    // );
  }

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      const l = await logOut();
      if (l) {
        setCurrentUser(null);
        setUser(null);
        navigate("/login");
      }
      toast.success("You were logged out");
    } catch (error) {
      console.log("error:", error);
      toast.error("Failed to logging out!!!");
    }
  };

  return (
    <nav className="leftsidebar h-screen">
      <div className="flex flex-col gap-8 h-full">
        <Link to="/" className="flex gap-2 items-center">
          <img
            src="/assets/cLogo-removebg.png"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        <Link
          to={`/profile/${user.accountId}`}
          className="flex gap-3 items-center"
        >
          <img
            src={user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-14 w-14 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user?.name || "userName"}</p>
            <p className="small-regular text-light-3">
              @{user?.username || "userName"}
            </p>
          </div>
        </Link>

        <ul className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-3"
                >
                  <img
                    src={link?.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={(e) => handleSignOut(e)}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
