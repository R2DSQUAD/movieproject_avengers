import { useState, useRef, useEffect } from "react";
import "../css/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/loginSlice";
import PropTypes from 'prop-types';
import * as Hangul from 'es-hangul'; // 수정된 import 방식


export default function Header({ isDarkMode, setIsDarkMode, isMemberInfoActive, setIsMemberInfoActive }) { // props 추가
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const memberInfoRef = useRef(null);
  const memberNameRef = useRef(null);
  const loginState = useSelector((state) => state.loginSlice);
  const isLoggedIn = !!loginState.email;

  const [searchQuery, setSearchQuery] = useState("");

  // 초성 여부 판단 함수
  const isChosungOnly = (text) => {
    // 정규 표현식: ㄱ-ㅎ, ㄳ, ㄵ, ㄶ, ㄺ, ㄻ, ㄼ, ㄽ, ㄾ, ㄿ, ㅀ, ㅄ
    const chosungRegex = /^[ㄱ-ㅎ]+$/;
    return chosungRegex.test(text);
  };

  const handleLogout = () => {
    dispatch(logout());
    alert("로그아웃되었습니다");
    navigate({ pathname: `/` }, { replace: true });
    window.location.reload();
  };

  const memberInfoOnClick = () => {
    setIsMemberInfoActive(!isMemberInfoActive);
  };

  useEffect(() => {
    // 외부 클릭 시 member-info-con 닫기
    const handleClickOutside = (event) => {
      if (memberInfoRef.current && !memberInfoRef.current.contains(event.target)) {
        setIsMemberInfoActive(false);
      }
    };

    // 글자 크기 조절
    const adjustFontSize = () => {
      const span = memberNameRef.current;
      if (!span) return;

      const parentWidth = span.parentElement.offsetWidth; // span's parent div width
      const spanWidth = span.offsetWidth;
      let fontSize = 16; // start fontSize

      if (parentWidth < spanWidth) { // 글자가 span의 크기보다 클 경우
        fontSize = Math.floor((parentWidth / spanWidth) * 16); // 크기를 줄여줍니다.
      }

      if (fontSize > 16) { // 최대 크기는 16px
        fontSize = 16;
      }
      span.style.fontSize = `${fontSize}px`;
    };

    adjustFontSize(); // Initial adjustment

    window.addEventListener("resize", adjustFontSize); // adjust when resize window
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener("resize", adjustFontSize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [loginState.nickname, setIsMemberInfoActive]); // setIsMemberInfoAcfrontpj/public/image/logo.pngtive 추가



  const handleSearch = (e) => {
    // 클릭 이벤트 또는 Enter 키 입력이 있을 때
    switch (e.type) {
        case "click":
        case "keydown":
            // Enter 키일 때만 처리 (클릭일 때는 조건이 필요 없으므로)
            if (e.type === "keydown" && e.key !== "Enter") return;

            if (searchQuery.trim() !== "") {
                const isChosung = isChosungOnly(searchQuery.trim());
                let queryToUse = searchQuery;
                let searchType = "normal";

                if (isChosung) {
                    queryToUse = Hangul.getChoseong(searchQuery.trim());
                    searchType = "chosung";
                }

                navigate(`/movie/search?query=${encodeURIComponent(queryToUse)}&searchType=${searchType}`);
            }
            break;

        // 다른 이벤트를 추가할 경우
        default:
            break;
    }
};
  

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
        <Link to="" className="nav-link">
          홈
        </Link>
        <Link to="/board" className="nav-link">
          게시판
        </Link>
        <Link to="/movie/search" className="nav-link">
          영화 검색
        </Link>
        <Link to="/movie/map" className="nav-link">
          영화관
        </Link>
        {isLoggedIn && loginState.roleNames && loginState.roleNames.includes("ADMIN") && (
          <Link to="/admin" className="nav-link">
            ADMIN
          </Link>
        )}


      </nav>
      <div className="bar">
        <div className="search-container">
          <input type="text" name="search" id="search" placeholder="영화 검색"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch} />
          <img src="/image/search.svg" alt="search" className="search-icon" onClick={handleSearch}/>
        </div>
        {isLoggedIn ? (
          <div className="member-info" ref={memberInfoRef} onClick={memberInfoOnClick}>
            <img
              className="member-info-img"
              src="/image/person.svg"
              alt="member-info"
            />
            <span ref={memberNameRef}>{loginState.nickname}님</span>
            <div className={`member-info-con ${isMemberInfoActive ? 'active' : ''}`}>
              <Link to="/member/detail">내 정보</Link>
              <Link to="/cart/myCartList">장바구니</Link>
              <Link to="/member/myPaymentList">결제내역</Link>
              <Link to="/chatroom">실시간채팅</Link>
              <Link to="/member/myChatList">채팅내역</Link>
              <span onClick={handleLogout}>로그아웃</span>
            </div>
          </div>
        ) : (
          <div className="member-info" ref={memberInfoRef} onClick={memberInfoOnClick}>
            <img
              className="member-info-img"
              src="/image/person.svg"
              alt="member-info"
            />
            <div className={`member-info-con ${isMemberInfoActive ? 'active' : ''}`}>
              <Link to="/member/login">로그인</Link>
            </div>
          </div>
        )}
        <div
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="toggle-button"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              setIsDarkMode((prev) => !prev);
            }
          }}
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

Header.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  setIsDarkMode: PropTypes.func.isRequired,
  isMemberInfoActive: PropTypes.bool.isRequired, // PropType 추가
  setIsMemberInfoActive: PropTypes.func.isRequired, // PropType 추가
};
