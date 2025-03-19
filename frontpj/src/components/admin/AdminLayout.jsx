import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import jwtAxios from "../../util/jwtUtil"; // 이미 설정된 jwtAxios 사용

import "../../css/admin/AdminLayout.css"; 
import AdminLeft from "./AdminLeft";

const AdminLayout = () => {
  const [data, setData] = useState('');
  
  useEffect(() => {
    const checkPermission = async () => {
      try {
        // 관리자 권한을 확인하는 API 호출
        const response = await jwtAxios.get("http://43.201.20.172:8090/api/test");
        console.log(response.data);
        setData(response.data.admin); // 관리자일 경우 권한 메시지 설정
      } catch (error) {
        console.error('Error fetching data:', error);
        setData('접근 권한이 없습니다.'); // 권한이 없을 경우 메시지
      }
    };

    checkPermission();
  }, []);

  if (data === '접근 권한이 없습니다.') {
    return <div>{data}</div>; // 권한이 없을 경우 메시지 보여주기
  }

  return (
    <div className="admin-container">
      <AdminLeft />
      <div className="admin-content">
        <Outlet /> {/* 자식 페이지들이 여기 렌더링됨 */}
      </div>
    </div>
  );
};

export default AdminLayout;
