import React, { useEffect, useState } from "react";
import Main from "../components/Main";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/MainPage.css";

const MainPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
      <Main />
      <Footer />
    </>
  );
};

export default MainPage;
