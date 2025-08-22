import { Outlet } from "react-router";
import LeftSidebar from "../components/LeftSidebar";
import Topbar from "../components/Topbar";
import Bottombar from "../components/Bottombar";

const RootLayout = () => {
  return (
    <main className="w-full h-screen md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full md:h-[100vh]">
        <Outlet />
      </section>

      <Bottombar />
    </main>
  );
};

export default RootLayout;
