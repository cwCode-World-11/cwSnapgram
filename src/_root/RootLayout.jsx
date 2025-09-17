import { Outlet } from "react-router";
import LeftSidebar from "../components/LeftSidebar";
import Topbar from "../components/Topbar";
import Bottombar from "../components/Bottombar";

const RootLayout = () => {
  return (
    <main className="w-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">{<Outlet />}</section>

      <Bottombar />
    </main>
  );
};

export default RootLayout;
