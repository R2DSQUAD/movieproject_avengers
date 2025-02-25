import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginPostAsync } from "../../slices/loginSlice";
import "../../css/Login.css";

const initState = {
  email: "",
  pw: "",
};

const Login = () => {
  const [loginParam, setLoginParam] = useState(initState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginParam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickLogin = () => {
    dispatch(loginPostAsync(loginParam)) //비동기방식
      .unwrap()
      .then((data) => {
        console.log(data);
        if (!data.accessToken) {
          alert("이메일과 패스워드를 다시 확인하세요");
        } else {
          alert("로그인 성공");
          navigate("/", { replace: true });
        }
      })
      .catch((error) => {
        console.error("로그인 오류:", error);
        alert("로그인 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="login">
      <h1>LOGIN</h1>
      <div className="login-con">
        <div className="email">
          <span>이메일</span>
          <input
            id="email"
            type="text"
            name="email"
            value={loginParam.email}
            onChange={handleChange}
          />
        </div>
        <div className="password">
          <span>비밀번호</span>
          <input
            id="pw"
            type="password"
            name="pw"
            value={loginParam.pw}
            onChange={handleChange}
          />
        </div>
        <div className="btn">
        <button onClick={handleClickLogin}>로그인</button>
        <Link to="/member/join">회원가입</Link>
      </div>
      </div>
    </div>
  );
};

export default Login;
