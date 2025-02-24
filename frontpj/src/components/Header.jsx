import { useEffect, useState } from "react";
import "../css/Header.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/loginSlice";
import { useNavigate } from "react-router-dom";

export default function Header({ isDarkMode, setIsDarkMode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const loginState = useSelector((state) => state.loginSlice);
  const isLoggedIn = !!loginState.email;

  const handleLogout = () => {
    dispatch(logout());
    alert("로그아웃되었습니다");
    navigate({ pathname: `/` }, { replace: true });
  };

  const memberInfoOnClick = () => {
    setIsVisible(!isVisible);
  }

  return (
    <header>
      <nav className="nav">
        <Link to="/">
          <div className="logo">
            <div className="logo-con">
              <img src="/image/logo.png" alt="logo" id="logo" />
              <span>Movie</span>
            </div>
          </div>
        </Link>
        <Link to="" className="nav-link">
          Home
        </Link>
        <Link to="" className="nav-link">
          Series
        </Link>
        <Link to="" className="nav-link">
          Movies
        </Link>
        <Link to="" className="nav-link">
          Kids
        </Link>
      </nav>
      <div className="bar">
        <div className="search-container">
          <input type="text" name="search" id="search" placeholder="search" />
          <img src="/image/search.svg" alt="search" className="search-icon" />
        </div>
        {isLoggedIn ? (
          <>
            <img className="member-info" src="./image/person.svg" alt="member-info" onClick={memberInfoOnClick} />
            <div className="member-info-con">
              <Link to="/member/detail">{loginState.email}님</Link>
              <button onClick={handleLogout}>로그아웃</button>
            </div>
          </>
        ) : (
          <>
            <img className="member-info" src="./image/person.svg" alt="member-info" onClick={memberInfoOnClick} />
            {isVisible && (
              <div className="member-info-con">
                <Link to="/member/join">회원가입</Link>
                <Link to="/member/login">로그인</Link>
              </div>
            )}
          </>
        )}
        <div
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="toggle-button"
        >
          {isDarkMode ? (
            <img src="/image/light.svg" alt="lightMode" id="lightMode"></img>
          ) : (
            <img src="/image/dark.svg" alt="darkMode" id="darkMode"></img>
          )}
        </div>
      </div>
    </header>
  );
}
