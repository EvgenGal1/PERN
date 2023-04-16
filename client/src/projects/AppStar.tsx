import React from "react";

import { Header } from "../Components/layout/AppStar/Header";
import AppRouterStar from "../Components/layout/AppStar/AppRouterStar";
import { Footer } from "../Components/layout/Footer";

import { BrowserRouter } from "react-router-dom";

import "../styles/styles.scss";

export function AppStar() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <AppRouterStar />
        <Footer />
      </BrowserRouter>
    </>
  );
}
