import React, { useEffect, useRef, useState } from "react";
import "../../css/Join.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Join = () => {
  const [formData, setFormData] = useState({
    email: "",
    pw: "",
    pw_check: "",
    nickname: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({}); // 서버에서 받은 에러 메시지 저장
  const [success, setSuccess] = useState(false); // 회원가입 성공 여부
  const [showPw, setShowPw] = useState(false);
  const [showPwChk, setShowPwChk] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // 기존 에러 초기화
    setSuccess(false);

    // 비밀번호 일치 여부 확인
    if (formData.pw !== formData.pw_check) {
      setErrors({ pw_check: "비밀번호가 일치하지 않습니다." });
      return;
    }

    try {
      await axios.post("http://43.201.20.172:8090/api/member/join", formData, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess(true); // 회원가입 성공
      setFormData({ email: "", pw: "", pw_check: "", nickname: "" }); // 입력 필드 초기화
      navigate("/member/login"); // 로그인 페이지로 이동
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data); // 서버에서 반환한 에러 메시지 저장
      }
    }
  };

  const toggleShowPw = () => {
    setShowPw(!showPw);
  };

  const toggleShowPwChk = () => {
    setShowPwChk(!showPwChk);
  };

  return (
    <div className="join">
      <h1>회원가입</h1>

      <div className="join-con">
        <form onSubmit={handleSubmit}>
          {/* 이메일 입력 */}
          <div className="email">
            <span>이메일</span>
            <input
              id="email"
              type="text"
              name="email"
              placeholder="이메일을 입력하세요."
              value={formData.email}
              onChange={handleChange}
              ref={inputRef}
            />
          </div>

          {/* 닉네임 입력 */}
          <div className="nickname">
            <span>닉네임</span>
            <input
              id="nickname"
              type="text"
              name="nickname"
              placeholder="닉네임을 입력하세요."
              value={formData.nickname}
              onChange={handleChange}
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="password">
            <span>비밀번호</span>
            <div>
              <input
                id="pw"
                type={showPw ? "text" : "password"}
                name="pw"
                placeholder="비밀번호를 입력하세요."
                value={formData.pw}
                onChange={handleChange}
              />

              {showPw ? ( //비밀번호 보이기/숨기기
                <div className="eye" onClick={toggleShowPw}>
                  {" "}
                  <img src="/image/eye.svg" alt="eye" />
                </div>
              ) : (
                <div className="eye" onClick={toggleShowPw}>
                  {" "}
                  <img src="/image/eye-slash.svg" alt="eye-slash" />
                </div>
              )}
            </div>
          </div>

          {/* 비밀번호 확인 입력 */}
          <div className="password_check">
            <span>비밀번호 확인</span>
            <div>
              <input
                id="pw_check"
                type={showPwChk ? "text" : "password"}
                name="pw_check"
                placeholder="비밀번호를 다시 입력하세요."
                value={formData.pw_check}
                onChange={handleChange}
              />

              {showPwChk ? ( //비밀번호 보이기/숨기기
                <div className="eye" onClick={toggleShowPwChk}>
                  {" "}
                  <img src="/image/eye.svg" alt="eye" />
                </div>
              ) : (
                <div className="eye" onClick={toggleShowPwChk}>
                  {" "}
                  <img src="/image/eye-slash.svg" alt="eye-slash" />
                </div>
              )}
            </div>
          </div>
          <div id="error-msg">
            {["email", "nickname", "pw", "pw_check"].map(
              (key) =>
                errors[key] && (
                  <span key={key} className="error">
                    {errors[key]}
                  </span>
                )
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="btn">
            <button type="submit">회원가입</button>
            <div className="loginBtn">
              <p>이미 가입하셨나요?</p>
              <Link to="/member/login">로그인</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Join;
