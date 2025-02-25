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
    window.location.reload();
  };

  const memberInfoOnClick = () => {
    setIsVisible(!isVisible);
  };

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
        <Link to="/movie/map" className="nav-link">
          Cinemas
        </Link>
      </nav>
      <div className="bar">
        <div className="search-container">
          <input type="text" name="search" id="search" placeholder="search" />
          <img src="/image/search.svg" alt="search" className="search-icon" />
        </div>
        {isLoggedIn ? (
          <>
            <div className="member-info">
              <img
                className="member-info-img"
                src="/image/person.svg"
                alt="member-info"
                onClick={memberInfoOnClick}
              />
              <Link to="/"><span>{loginState.nickname}님</span></Link>
              {isVisible && (
                <div className="member-info-con">  
                  <button onClick={handleLogout}>로그아웃</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
          <Link to="/member/login">
            <div className="member-info">
              <img
                className="member-info-img"
                src="/image/person.svg"
                alt="member-info"
                onClick={memberInfoOnClick}
              />
              <div className="member-info-con">
                <span>로그인</span>
              </div>
            </div>
            </Link>
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
