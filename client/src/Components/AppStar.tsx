import React from "react";

import { Header } from "./layout/AppStar/Header";
import AppRouterStar from "./layout/AppStar/AppRouterStar";
import { Footer } from "./layout/Footer";

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
