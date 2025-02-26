import React from "react";
import { Link } from "react-router-dom";
import "../../css/admin/AdminLeft.css";

const AdminLeft = () => {
  return (
    <div className="admin-left">
      <h2 className="admin-title">관리자 메뉴</h2>
      <ul className="admin-menu">
        <li>
          <Link to="/admin">대시보드</Link>
        </li>
        <li>
          <Link to="/admin/memberList">회원 관리</Link>
        </li>
        <li>
          <Link to="/admin/calendar">일정 관리</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminLeft;
