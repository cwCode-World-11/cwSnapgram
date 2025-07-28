import { Outlet } from "react-router";
import { Navigate } from "react-router";
import photo from "/assets/authDisplay.jpg";

const AuthLayout = () => {
  const isAuthenticated = true;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <section className="flex items-center justify-center">
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img
            src={photo}
            alt="logo"
            className="hidden lg:block h-screen w-1/2 object-cover bg-no-repeat border-[#1F1F22]"
          />
        </section>
      )}
    </>
  );
};

export default AuthLayout;
