import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Komoran from "../components/ws/Komoran";
import "../css/main.css";

 
const MainLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMemberInfoActive, setIsMemberInfoActive] = useState(false);
  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // 채팅창 상태 초기값 설정
  const location = useLocation();

  const updateHeaderStyle = useCallback(() => {
    const scrolled = window.scrollY > 0;
    const isMainPage = location.pathname === "/";
    const isLightMode = document.body.classList.contains("light");
    const isDarkMode = document.body.classList.contains("dark");

    setIsHeaderActive(scrolled);

    const backgroundColor = isHeaderActive
      ? isLightMode
        ? "var(--color-light-2)"
        : "var(--color-dark-2)"
      : "transparent";
    const textColor =
      isMainPage && !scrolled
        ? "var(--color-dark-text)"
        : "var(--color-light-text)";
    const imgFilter = isMainPage && !scrolled ? "invert(100%)" : "invert(0%)";
    const spanColor = isLightMode ? textColor : "var(--color-dark-text)";

    const header = document.querySelector("header");
    if (header) {
      header.style.backgroundColor = backgroundColor;
    }
    document
      .querySelectorAll("header a, header .bar img, header span")
      .forEach((el) => {
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
          default:
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
    updateHeaderStyle();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDarkMode, location.pathname, updateHeaderStyle, isHeaderActive]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isMemberInfoActive={isMemberInfoActive}
        setIsMemberInfoActive={setIsMemberInfoActive}
        isHeaderActive={isHeaderActive}
      />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
      {/* 채팅 창 */}
      {isChatOpen && <Komoran isOpen={isChatOpen} onClose={toggleChat} />}

      {/* 채팅 버튼 */}
      <div className="chat-float-button" onClick={toggleChat}>
        <img
          className="chat-icon"
          src={isChatOpen ? "/image/close.svg" : "/image/chat.svg"}
          alt={isChatOpen ? "닫기" : "채팅"}
        />
      </div>
    </>
  );
};

export default MainLayout;
