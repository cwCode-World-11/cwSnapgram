import { Outlet } from "react-router";
import logo from "../../public/assets/cLogo-removebg.png";
import photo from "/assets/authDisplay.jpg";

const AuthLayout = () => {
  return (
    <>
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>

      <img
        src={photo}
        alt="logo"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat border-[#1F1F22]"
      />
    </>
  );
};

export default AuthLayout;
