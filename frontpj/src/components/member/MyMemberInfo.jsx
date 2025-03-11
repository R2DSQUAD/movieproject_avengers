import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/MyMemberInfo.css";
import jwtAxios from "../../util/jwtUtil";

const MyMemberInfo = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [updateForm, setUpdateForm] = useState({
    nickname: "",
    newPassword: "",
    confirmPassword: "",
  });
  const inputRef = useRef(null);

  useEffect(() => {
    if (showUpdateModal && inputRef.current && !isVerified) {
      inputRef.current.focus();
    }
  }, [showUpdateModal, isVerified]);

  const fetchMemberInfo = async () => {
    try {
      const response = await jwtAxios.get(
        "http://localhost:8090/api/myinfo/detail"
      );
      setMember(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/member/login", { replace: true });
      } else {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      }
    }
  };

  useEffect(() => {
    fetchMemberInfo();
  }, []);

  const handleOpenUpdateModal = () => {
    setShowUpdateModal(true);
    setIsVerified(false);
    setCurrentPassword("");
    setUpdateForm({
      nickname: member ? member.nickname : "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleVerifyPassword = async () => {
    try {
      await jwtAxios.put("http://localhost:8090/api/myinfo/update", {
        currentPassword: currentPassword,
        nickname: member.nickname,
        newPassword: "",
      });
      setIsVerified(true);
    } catch (error) {
      alert("현재 비밀번호가 올바르지 않습니다.");
      console.error("비밀번호 검증 실패:", error);
    }
  };

  const handleUpdateMember = async () => {
    if (updateForm.newPassword) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
      if (!passwordRegex.test(updateForm.newPassword)) {
        alert("비밀번호는 영문과 숫자를 포함한 8~20자여야 합니다.");
        return;
      }
      if (updateForm.newPassword !== updateForm.confirmPassword) {
        alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        return;
      }
    }
    try {
      await jwtAxios.put("http://localhost:8090/api/myinfo/update", {
        currentPassword: currentPassword,
        nickname: updateForm.nickname,
        newPassword: updateForm.newPassword,
      });
      alert("정보가 업데이트되었습니다.");
      setShowUpdateModal(false);
      fetchMemberInfo();
    } catch (error) {
      console.error("정보 업데이트 실패:", error);
      alert("정보 업데이트에 실패했습니다.");
    }
  };

  return (
    <div className="memberInfo">
      <div className="userTitle">
        <span>안녕하세요!</span>
        <span>{member ? member.nickname : ""}님</span>
        <button onClick={handleOpenUpdateModal}>정보 수정하기</button>
      </div>

      {member ? (
        <div className="memberInfoContent">
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

      {showUpdateModal && (
        <div className="modal">
          <div className="modal-content">
            {!isVerified ? (
              <div>
                <h3>현재 비밀번호 확인</h3>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호"
                  ref={inputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleVerifyPassword();
                    }
                  }}
                />
                <button onClick={() => setShowUpdateModal(false)}>취소</button>
                <button onClick={handleVerifyPassword}>확인</button>
              </div>
            ) : (
              <div>
                <h3>정보 수정</h3>
                <button onClick={handleUpdateMember}>수정 완료</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMemberInfo;
