import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/MyMemberInfo.css";
import jwtAxios from "../../util/jwtUtil";

const MyMemberInfo = () => {
  const [member, setMember] = useState(null);
  const navigate = useNavigate();

  const fetchMemberInfo = async () => {
    try {
      const response = await jwtAxios.get(
        "http://localhost:8090/api/myinfo/detail"
      );
      setMember(response.data); // 사용자 정보 상태에 저장
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/member/login", { replace: true });
      } else {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      }
    }
  };

  console.log(member);

  useEffect(() => {
    fetchMemberInfo();
  }, []);

  return (
    <div className="memberInfo">
      <div className="userTitle">
        <span>
            안녕하세요!
        </span>
        <span>
            {member ? member.nickname : ""}님
        </span>
      </div>  
      {/* <div>개인정보 수정/삭제 로직 나중에 추가예정입니다</div> */}
      {member ? (
        <div className="memberInfoContent" >
          <div className="email">
            <span>이메일</span>
            <span>{member.email}</span>
          </div>
          <div className="social">
            <span>소셜 계정</span>
            <span>{member.social ? "사용 중" : "사용 안 함"}</span>
          </div>
          <div className="role">
            <span>권한</span>
            <span>{member.roleNames.join(", ")}</span>
          </div>
        </div>
      ) : (
        <span>사용자 정보를 불러오는 중입니다...</span>
      )}
    </div>
  );
};

export default MyMemberInfo;
