import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // 헤더 스타일 업데이트 함수
  const updateHeaderStyle = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrolled = currentScrollY > 0;
    const isMainPage = location.pathname === "/";

    if (document.body.classList.contains("light")) {
      document.querySelectorAll("header, header a, header img, header span").forEach((el) => {
        if (el.tagName === "HEADER") {
          el.style.backgroundColor = scrolled ? "#DDDDDD" : "transparent";
        } else if (el.tagName === "A") {
          el.style.color = isMainPage ? (scrolled ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)") : "rgba(0,0,0,0.5)";
        } else if (el.tagName === "IMG") {
          el.style.filter = isMainPage ? (scrolled ? "invert(0%)" : "invert(100%)") : "invert(0%)";
          el.style.opacity = "0.5";
        } else if (el.tagName === "SPAN") {
          el.style.color = isMainPage ? (scrolled ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)") : "rgba(0,0,0,0.5)";
        }
      });
    } else if (document.body.classList.contains("dark")) {
      document.querySelectorAll("header, header a, header img, header span").forEach((el) => {
        if (el.tagName === "HEADER") {
          el.style.backgroundColor = scrolled ? "#222222" : "transparent";
        } else if (el.tagName === "A") {
          el.style.color = "rgba(255,255,255,0.5)";
        } else if (el.tagName === "IMG") {
          el.style.filter = "invert(100%)";
          el.style.opacity = "0.5";
        } else if (el.tagName === "SPAN") {
          el.style.color = "rgba(255,255,255,0.5)";
        }
      });
    }
  }, [location.pathname]);

  // 통합된 useEffect 훅
  useEffect(() => {
    // 다크/라이트 모드 클래스 설정
    if (!isDarkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // 스크롤 방향에 따른 isTop 업데이트
      if (currentScrollY > lastScrollY) {
        setIsTop(false);
      } else if (currentScrollY < lastScrollY) {
        setIsTop(true);
      }
      setLastScrollY(currentScrollY);
      updateHeaderStyle();
    };

    // 초기 스타일 업데이트 (최상단일 때)
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDarkMode, location.pathname, lastScrollY, updateHeaderStyle]);

  return (
    <>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isTop={isTop} />
      <Outlet context={{ setIsTop }} />
      <Footer />
    </>
  );
};

export default MainLayout;