import { Link, NavLink, useLocation, useNavigate } from "react-router";
import Loader from "./Loader";
import { Button } from "./ui/button";
import { sidebarLinks } from "../lib/constants";

const LeftSidebar = () => {
  let user;

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSignOut = async (e) => {
    e.preventDefault();
    navigate("/login");
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
        {/*TODO: <Link to={`/profile/${user.id}`} className="flex gap-3 items-center"> */}
        <Link to={`/profile/123`} className="flex gap-3 items-center">
          <img
            src={user?.imageUrl || "/assets/profile1.jpg"}
            alt="profile"
            className="h-14 w-14 rounded-full"
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
