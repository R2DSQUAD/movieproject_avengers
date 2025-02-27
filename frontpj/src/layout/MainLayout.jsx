import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMemberInfoActive, setIsMemberInfoActive] = useState(false);
  const [isHeaderActive, setIsHeaderActive] = useState(false); // 스크롤 상태를 저장하는 상태 변수 추가
  const location = useLocation();

  const updateHeaderStyle = useCallback(() => {
    const scrolled = window.scrollY > 0;
    const isMainPage = location.pathname === "/";
    const isLightMode = document.body.classList.contains("light");
    const isDarkMode = document.body.classList.contains("dark");

    setIsHeaderActive(scrolled); // 스크롤 여부에 따라 상태 업데이트

    // 배경색은 isHeaderActive에 따라 동적으로 변경
    const backgroundColor = isHeaderActive ? (isLightMode ? "var(--color-light-2)" : "var(--color-dark-2)") : "transparent";
    const textColor = isMainPage && !scrolled ? "var(--color-dark-text)" : "var(--color-light-text)";
    const imgFilter = isMainPage && !scrolled ? "invert(100%)" : "invert(0%)";
    const spanColor = isLightMode ? textColor : "var(--color-dark-text)";

    const header = document.querySelector("header");
    if (header) {
        header.style.backgroundColor = backgroundColor;
      }
    document.querySelectorAll("header a, header img, header span").forEach((el) => {
      switch (el.tagName) {
        case "A":
          el.style.color = isLightMode ? textColor : "var(--color-dark-text)";
          break;
        case "IMG":
          el.style.filter = isLightMode ? imgFilter : "invert(100%)";
          el.style.opacity = "0.5";
          break;
        case "SPAN":
          el.style.color = spanColor;
          break;
      }
    });
  }, [location.pathname, isHeaderActive]);

  useEffect(() => {
    document.body.classList.toggle("dark", !isDarkMode);
    document.body.classList.toggle("light", isDarkMode);

    const handleScroll = () => {
      updateHeaderStyle();
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDarkMode, location.pathname, updateHeaderStyle]);

  useEffect(() => {
    console.log(document.querySelector('.member-info-con.active a'));
  },[isHeaderActive])

  return (
    <>
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isMemberInfoActive={isMemberInfoActive}
        setIsMemberInfoActive={setIsMemberInfoActive}
        isHeaderActive={isHeaderActive} // 스크롤 상태를 Header로 전달
      />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
