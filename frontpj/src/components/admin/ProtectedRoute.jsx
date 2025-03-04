import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user")); // JWT에서 사용자 정보 가져오기
    const isAdmin = user?.roleNames?.includes("ADMIN"); // 'ROLE_ADMIN' 권한 확인

    if (!isAdmin) {
        return <Navigate to="/" replace />; // 관리자 권한 없으면 메인 페이지로 이동
    }

    return children;
};

export default ProtectedRoute;
