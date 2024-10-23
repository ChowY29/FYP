// src/scenes/layout/index.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "componenets/adminSidebar";

const Layout = () => {
  return (
    <div>
      <AdminSidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
