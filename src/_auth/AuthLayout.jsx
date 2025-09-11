import { Outlet } from "react-router";
import { Navigate, useLocation } from "react-router";
import photo from "/assets/authDisplay.jpg";
import { useAuth } from "../context/AuthContext";

const AuthLayout = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const isAuthenticated = user && true;

  // The login, sign-up, and forget password pages should be accessible
  // when the user is NOT authenticated.
  // The update-user page should be accessible when the user IS authenticated
  // and in a recovery flow.
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/sign-up" ||
    pathname === "/forget-password";
  const isUpdateUserPage = pathname === "/update-user";

  // Logic to determine if we should redirect
  const shouldRedirect = isAuthenticated && isAuthPage;

  return (
    <>
      {shouldRedirect ? (
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
