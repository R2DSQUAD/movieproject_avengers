import { useState, useRef, useEffect } from "react";
import "../css/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/loginSlice";
import PropTypes from "prop-types";
import * as Hangul from "es-hangul";

export default function Header({
  isDarkMode,
  setIsDarkMode,
  isMemberInfoActive,
  setIsMemberInfoActive,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const memberInfoRef = useRef(null);
  const memberNameRef = useRef(null);
  const loginState = useSelector((state) => state.loginSlice);
  const isLoggedIn = !!loginState.email;

  const [searchQuery, setSearchQuery] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);

  const isChosungOnly = (text) => /^[ㄱ-ㅎ]+$/.test(text);

  const handleLogout = () => {
    dispatch(logout());
    alert("로그아웃되었습니다");
    navigate("/", { replace: true });
    window.location.reload();
  };

  const memberInfoOnClick = () => setIsMemberInfoActive(!isMemberInfoActive);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        memberInfoRef.current &&
        !memberInfoRef.current.contains(event.target)
      ) {
        setIsMemberInfoActive(false);
      }
    };

    const adjustFontSize = () => {
      const span = memberNameRef.current;
      if (!span) return;
      const parentWidth = span.parentElement.offsetWidth;
      const spanWidth = span.offsetWidth;
      let fontSize = 16;
      if (parentWidth < spanWidth) {
        fontSize = Math.floor((parentWidth / spanWidth) * 16);
      }
      if (fontSize > 16) fontSize = 16;
      span.style.fontSize = `${fontSize}px`;
    };

    const handleResize = () => setIsMobile(window.innerWidth <= 1023);

    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", adjustFontSize);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [loginState.nickname, setIsMemberInfoActive]);

  const handleSearch = (e) => {
    if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
      if (searchQuery.trim()) {
        const isChosung = isChosungOnly(searchQuery.trim());
        const queryToUse = isChosung
          ? Hangul.getChoseong(searchQuery.trim())
          : searchQuery.trim();
        const searchType = isChosung ? "chosung" : "normal";

        navigate(
          `/movie/search?query=${encodeURIComponent(
            queryToUse
          )}&searchType=${searchType}`
        );
      }
    }
  };

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const renderMemberInfo = () => (
    <div className="member-info" ref={memberInfoRef} onClick={memberInfoOnClick}>
      <img className="member-info-img" src="/image/person.svg" alt="member-info" />
      {isLoggedIn && <span ref={memberNameRef}>{loginState.nickname}님</span>}
      <div className={`member-info-con ${isMemberInfoActive ? "active" : ""}`}>
        {isLoggedIn ? (
          <>
            <Link to="/member/detail">내 정보</Link>
            <Link to="/cart/myCartList">장바구니</Link>
            <Link to="/member/myPaymentList">결제내역</Link>
            <Link to="/chatroom">실시간채팅</Link>
            <Link to="/member/myChatList">채팅내역</Link>
            <span onClick={handleLogout}>로그아웃</span>
          </>
        ) : (
          <Link to="/member/login">로그인</Link>
        )}
      </div>
    </div>
  );

  return (
    <header>
      <nav className="nav">
        <Link to="/">
          <div className="logo">
            <div className="logo-con">
              <img src="/image/logo.png" alt="logo" id="logo" />
              <span>Frame In</span>
            </div>
          </div>
        </Link>
        {!isMobile && (
          <div className={`nav-menu ${isNavOpen ? "open" : ""}`}>
            <Link to="/" className="nav-link">홈</Link>
            <Link to="/board" className="nav-link">게시판</Link>
            <Link to="/movie/search" className="nav-link">영화 검색</Link>
            <Link to="/movie/map" className="nav-link">영화관</Link>
            {isLoggedIn && loginState.roleNames?.includes("ADMIN") && (
              <Link to="/admin" className="nav-link">ADMIN</Link>
            )}
          </div>
        )}
      </nav>
      {isMobile && (
        <div className={`mobile-nav ${isNavOpen ? "open" : ""}`}>
          <div className="search-container">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="영화 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <img src="/image/search.svg" alt="search" className="search-icon" onClick={handleSearch} />
          </div>
          <div className="nav-menu">
            <Link to="/" className="nav-link">홈</Link>
            <Link to="/board" className="nav-link">게시판</Link>
            <Link to="/movie/search" className="nav-link">영화 검색</Link>
            <Link to="/movie/map" className="nav-link">영화관</Link>
            {isLoggedIn && loginState.roleNames?.includes("ADMIN") && (
              <Link to="/admin" className="nav-link">ADMIN</Link>
            )}
          </div>
          {renderMemberInfo()}
        </div>
      )}
      <div className="bar">
        {!isMobile && (
          <div className="search-container">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="영화 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <img src="/image/search.svg" alt="search" className="search-icon" onClick={handleSearch} />
          </div>
        )}
        {!isMobile && renderMemberInfo()}
        <div
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="toggle-button"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && setIsDarkMode((prev) => !prev)}
        >
          {isDarkMode ? (
            <img src="/image/light.svg" alt="lightMode" id="lightMode" />
          ) : (
            <img src="/image/dark.svg" alt="darkMode" id="darkMode" />
          )}
        </div>
        <div className="hamburger-menu" onClick={toggleNav}>
          <img src="/image/list.svg" alt="menu" />
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  setIsDarkMode: PropTypes.func.isRequired,
  isMemberInfoActive: PropTypes.bool.isRequired,
  setIsMemberInfoActive: PropTypes.func.isRequired,
};
