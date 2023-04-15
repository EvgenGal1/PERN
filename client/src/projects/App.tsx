import React from "react";

import { Header } from "../Components/layout/Header";
import /* { */ AppRouterStar /* } */ from "../Components/layout/AppRouterStar";
import { Footer } from "../Components/layout/Footer";

import { BrowserRouter } from "react-router-dom";

import "../styles/styles.scss";

export function App() {
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
