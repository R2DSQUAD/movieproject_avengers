// src/pages/MoviesPage.js
import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LoginForm from "../../components/member/Login";

const MoviesPage = () => {
  return (
    <div>
      <Header /> 
      <LoginForm/>
      <Footer />
    </div>
  );
};

export default MoviesPage;
