import { useEffect, useState } from "react";
import "../css/Header.css";
import { Link } from "react-router-dom";

export default function Header({ isDarkMode, setIsDarkMode }) {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/">
          <div className="logo">
            <div className="logo-con">
              <img src="/image/logo.png" alt="logo" id="logo" />
              <p>Movie</p>
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
        <input type="text" name="search" id="search" placeholder="search" />
        <Link to="">프로필</Link>
        <Link to="/member/join"> 회원가입</Link>
        <Link to="/member/login" > 로그인</Link>
        <div onClick={() => setIsDarkMode((prev) => !prev)} className="toggle-button">
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
