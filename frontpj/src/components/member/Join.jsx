import React, { useState } from "react";
import "../../css/Join.css";
import axios from "axios";

const Join = () => {
  const [formData, setFormData] = useState({
    email: "",
    pw: "",
    pw_check: "",
    nickname: "",
  });

  const [errors, setErrors] = useState({}); // 서버에서 받은 에러 메시지 저장
  const [success, setSuccess] = useState(false); // 회원가입 성공 여부

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
      await axios.post("http://localhost:8090/api/member/join", formData, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess(true); // 회원가입 성공
      setFormData({ email: "", pw: "", pw_check: "", nickname: "" }); // 입력 필드 초기화
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data); // 서버에서 반환한 에러 메시지 저장
      }
    }
  };

  return (
    <div className="join">
      <h1>Join</h1>
      {success && <p style={{ color: "green" }}>회원가입 성공!</p>}
      <div className="join-con">
        <form onSubmit={handleSubmit}>
          {/* 닉네임 입력 */}
          <div className="nickname">
            <span>닉네임</span>
            <input
              id="nickname"
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
            />
          </div>
          {errors.nickname && <p style={{ color: "red" }}>{errors.nickname}</p>}

          {/* 이메일 입력 */}
          <div className="email">
            <span>이메일</span>
            <input
              id="email"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

          {/* 비밀번호 입력 */}
          <div className="password">
            <span>비밀번호</span>
            <input
              id="pw"
              type="password"
              name="pw"
              value={formData.pw}
              onChange={handleChange}
            />
          </div>
          {errors.pw && <p style={{ color: "red" }}>{errors.pw}</p>}

          {/* 비밀번호 확인 입력 */}
          <div className="password_check">
            <span>비밀번호 확인</span>
            <input
              id="pw_check"
              type="password"
              name="pw_check"
              value={formData.pw_check}
              onChange={handleChange}
            />
          </div>
          {errors.pw_check && <p style={{ color: "red" }}>{errors.pw_check}</p>}

          {/* 버튼 영역 */}
          <div className="btn">
            <button type="submit">회원가입</button>
            <span>로그인</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Join;
