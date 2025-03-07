import React from "react";
import { Link } from "react-router-dom";
import "../../css/admin/AdminLeft.css";

const AdminLeft = () => {
  return (
    <div className="admin-left">
      <h2 className="admin-title">관리자 메뉴</h2>
      <ul className="admin-menu">
        <li>
          <Link to="/admin">관리자 홈</Link>
        </li>
        <li>
          <Link to="/admin/memberList">회원 관리</Link>
        </li>
        <li>
          <Link to="/admin/cinemas">영화관 관리</Link>
        </li>
        <li>
          <Link to="/admin/calendar">일정 관리</Link>
        </li>
        <li>
          <Link to="/admin/chatbot">챗봇 관리</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminLeft;
