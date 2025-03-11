import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginPostAsync } from "../../slices/loginSlice";
import "../../css/Login.css";
import KakaoLogin from "./KakaoLogin";

const initState = {
  email: "",
  pw: "",
};

const Login = () => {
  const [loginParam, setLoginParam] = useState(initState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginParam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const activeEnter = (e) => {
    if (e.key === "Enter") {
      handleClickLogin();
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

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

  const toggleShowPw = () => {
    setShowPw(!showPw);
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
            placeholder="이메일을 입력하세요."
            value={loginParam.email}
            onChange={handleChange}
            onKeyDown={activeEnter}
            ref={inputRef}
          />
        </div>
        <div className="password">
          <span>비밀번호</span>
          <div>
            <input
              id="pw"
              type={showPw ? "text" : "password"}
              name="pw"
              value={loginParam.pw}
              placeholder="비밀번호를 입력하세요."
              onChange={handleChange}
              onKeyDown={activeEnter}
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
          <KakaoLogin />
          <Link to="/member/join">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
