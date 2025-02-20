import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (!isDarkMode) {
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
        <Outlet/>
      <Footer />
    </>
  )
}

export default MainLayout
