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
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginParam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const activeEnter = (e) => {
    if(e.key === "Enter") {
      handleClickLogin();
    }
  }

  const validate = () => {
    const newErrors = {};
    if (!loginParam.email) newErrors.email = "이메일을 입력하세요.";
    if (!loginParam.pw) newErrors.pw = "비밀번호를 입력하세요.";
    return newErrors;
  };

  const handleClickLogin = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(loginPostAsync(loginParam)) //비동기방식
      .unwrap()
      .then((data) => {
        if (!data.accessToken) {
          setErrors({ general: "이메일과 비밀번호를 다시 확인하세요" });
        } else {
          navigate("/", { replace: true });
        }
      })
      .catch((error) => {
        console.error("로그인 오류:", error);
        setErrors({ general: "로그인 중 오류가 발생했습니다." });
      });
  };

  return (
    <div className="login">
      <h1>로그인</h1>
      <div className="login-con">
        <div className="email">
          <span>이메일</span>
          <input
            id="email"
            type="text"
            name="email"
            value={loginParam.email}
            onChange={handleChange}
            onKeyDown={activeEnter}
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
            onKeyDown={activeEnter}
          />
        </div>
        <div id="error-msg">
          {["email", "pw", "general"].map(
            (key) =>
              errors[key] && (
                <span key={key} className="error-message">
                  {errors[key]}
                </span>
              )
          )}
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