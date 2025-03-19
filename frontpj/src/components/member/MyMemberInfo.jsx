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
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    nickname: "",
    newPassword: "",
    confirmPassword: "",
  });
  const inputRef = useRef(null);
  const [formErrors, setFormErrors] = useState({
    nickname: "",
    newPassword: "",
    confirmPassword: "",
    currentPassword:""
  });

  useEffect(() => {
    if (showUpdateModal && inputRef.current && !isVerified) {
      inputRef.current.focus();
    }
  }, [showUpdateModal, isVerified]);

  const fetchMemberInfo = async () => {
    try {
      const response = await jwtAxios.get(
        "http://43.201.20.172:8090/api/myinfo/detail"
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
    setFormErrors({
      nickname: "",
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
    });
  };

  const handleVerifyPassword = async () => {
    try {
      const response = await jwtAxios.post("http://43.201.20.172:8090/api/auth/verify-password", {
        currentPassword: currentPassword,
      });
      if (response.data.verified) {
        setIsVerified(true);
      } else {
        setFormErrors({ ...formErrors, currentPassword: "현재 비밀번호가 올바르지 않습니다." });
      }
    } catch (error) {
      setFormErrors({ ...formErrors, currentPassword: "현재 비밀번호가 올바르지 않습니다." });
    }
  };

  const handleUpdateMember = async () => {
    let errors = {};
    let isValid = true;
  
    console.log("업데이트 폼 데이터:", updateForm);  // 데이터 확인
  
    if (!updateForm.nickname) {
      errors.nickname = "닉네임을 입력해주세요.";
      isValid = false;
    } else if (updateForm.nickname.length < 2) {
      errors.nickname = "닉네임은 최소 2자 이상이어야 합니다.";
      isValid = false;
    }
  
    // 닉네임 비교
    if (updateForm.nickname === member.nickname) {
      errors.nickname = "새 닉네임이 기존 닉네임과 동일합니다.";
      isValid = false;
    }
  
    if (updateForm.newPassword) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;
      if (!passwordRegex.test(updateForm.newPassword)) {
        errors.newPassword = "비밀번호는 영문과 숫자를 포함한 8~20자여야 합니다.";
        isValid = false;
      }
      if (updateForm.newPassword !== updateForm.confirmPassword) {
        errors.confirmPassword = "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.";
        isValid = false;
      }
    }
  
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
  
    const dataToUpdate = {
      nickname: updateForm.nickname,
      pw: updateForm.newPassword,
    };
  
    try {
      const response = await jwtAxios.put("http://43.201.20.172:8090/api/myinfo/update", dataToUpdate);
      alert("정보가 업데이트되었습니다.");
      setShowUpdateModal(false);
      fetchMemberInfo();
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert("정보 업데이트에 실패했습니다.");
      }
    }
  };
  

  return (
    <div className="memberInfo">
      <div className="userTitle">
        <span>안녕하세요!</span>
        <span>{member ? member.nickname : ""}님</span>
      </div>

      {member ? (
        <div className="memberInfoContent">
          <button className="memberUpdateBtn" onClick={handleOpenUpdateModal}>
            정보 수정하기
          </button>
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
            <div className="modal-close">
              <img src="./../image/close.svg" alt="close" onClick={() => setShowUpdateModal(false)} />
            </div>
            {!isVerified ? (
              <div>
                <div className="password">
                  <span>현재 비밀번호</span>
                  <div>
                    <input
                      id="currentPw"
                      type={showCurrentPw ? "text" : "password"}
                      value={currentPassword}
                      placeholder="현재 비밀번호를 입력하세요."
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      ref={inputRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleVerifyPassword();
                      }}
                    />
                    <div
                      className="eye"
                      onClick={() => setShowCurrentPw((prev) => !prev)}
                    >
                      <img
                        src={
                          showCurrentPw
                            ? "/image/eye.svg"
                            : "/image/eye-slash.svg"
                        }
                        alt="toggle-pw"
                      />
                    </div>
                  </div>
                  {formErrors.currentPassword && (
                    <div className="error">{formErrors.currentPassword}</div>
                  )}
                </div>

                <div className="modal-actions">
                  <button onClick={handleVerifyPassword}>확인</button>
                </div>
              </div>
            ) : (
              <div className="updateForm">
                <h2>정보 수정</h2>
                <span>닉네임 변경</span>
                <input
                  type="text"
                  value={updateForm.nickname}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, nickname: e.target.value })
                  }
                />
                {formErrors.nickname && <div className="error">{formErrors.nickname}</div>}
                <div className="password">
                  <span>새 비밀번호</span>
                  <div>
                    <input
                      id="newPw"
                      type={showNewPw ? "text" : "password"}
                      value={updateForm.newPassword}
                      placeholder="새 비밀번호를 입력하세요."
                      onChange={(e) =>
                        setUpdateForm({
                          ...updateForm,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <div
                      className="eye"
                      onClick={() => setShowNewPw((prev) => !prev)}
                    >
                      <img
                        src={
                          showNewPw ? "/image/eye.svg" : "/image/eye-slash.svg"
                        }
                        alt="toggle-pw"
                      />
                    </div>
                  </div>
                  {formErrors.newPassword && (
                    <div className="error">{formErrors.newPassword}</div>
                  )}
                </div>
                <div className="password">
                  <span>새 비밀번호 확인</span>
                  <div>
                    <input
                      id="confirmPw"
                      type={showConfirmPw ? "text" : "password"}
                      value={updateForm.confirmPassword}
                      placeholder="새 비밀번호를 다시 입력하세요."
                      onChange={(e) =>
                        setUpdateForm({
                          ...updateForm,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <div
                      className="eye"
                      onClick={() => setShowConfirmPw((prev) => !prev)}
                    >
                      <img
                        src={
                          showConfirmPw
                            ? "/image/eye.svg"
                            : "/image/eye-slash.svg"
                        }
                        alt="toggle-pw"
                      />
                    </div>
                  </div>
                  {formErrors.confirmPassword && (
                    <div className="error">{formErrors.confirmPassword}</div>
                  )}
                </div>
                <div className="modal-actions">
                  <button onClick={handleUpdateMember}>수정</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMemberInfo;
