// src/pages/MoviesPage.js
import React from "react";
import BoxOfficeList from "../../components/movie/BoxOfficeList";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const MoviesPage = () => {
  return (
    <div>
      <Header /> 
      <BoxOfficeList />
      <Footer />
    </div>
  );
};

export default MoviesPage;
