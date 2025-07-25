import React from "react";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div>
      RootLayout
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
