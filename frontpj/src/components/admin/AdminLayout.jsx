import React from "react";
import { Outlet } from "react-router-dom";

import "../../css/admin/AdminLayout.css"; 
import AdminLeft from "./AdminLeft";

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <AdminLeft />
      <div className="admin-content">
        <Outlet /> 
      </div>
    </div>
  );
};

export default AdminLayout;
