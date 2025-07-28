import { Link, NavLink, useLocation, useNavigate } from "react-router";

// import { sidebarLinks } from "@/constants";
import Loader from "./Loader";
import { Button } from "./ui/button";

const sidebarLinks = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/wallpaper.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: "/assets/icons/people.svg",
    route: "/all-users",
    label: "People",
  },
  {
    imgURL: "/assets/icons/bookmark.svg",
    route: "/saved",
    label: "Saved",
  },
  {
    imgURL: "/assets/icons/gallery-add.svg",
    route: "/create-post",
    label: "Create Post",
  },
];

const LeftSidebar = () => {
  let user;

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSignOut = async () => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-8">
        <Link to="/" className="flex gap-2 items-center">
          <img
            src="/assets/cLogo-removebg.png"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        {/* <Link to={`/profile/${user.id}`} className="flex gap-3 items-center"> */}
        <Link to={`/profile/123`} className="flex gap-3 items-center">
          <img
            src={user?.imageUrl || "/assets/profile.jpg"}
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

        <ul className="flex flex-col gap-6">
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
                  className="flex gap-4 items-center p-4"
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
