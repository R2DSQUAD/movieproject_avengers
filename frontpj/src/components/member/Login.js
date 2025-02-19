import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useHistory 대신 useNavigate 사용

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();  // useHistory -> useNavigate

  // 로그인 요청
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 서버에 로그인 요청 보내기
      const response = await axios.post("http://localhost:8090/member/login", {
        userEmail: email,
        userPw: password,
      },{
        withCredentials: true

      });

      // 성공적으로 토큰을 받은 경우
      const { token } = response.data;

      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("access_token", token);
      // 성공 시 메인 페이지로 이동
      navigate("/dashboard");  // history.push -> navigate("/dashboard")
    } catch (err) {
      setError("로그인 실패. 이메일 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LoginPage;
