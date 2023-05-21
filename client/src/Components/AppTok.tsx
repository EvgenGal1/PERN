import React from "react";
import { BrowserRouter } from "react-router-dom";

import AppRouterTok from "./layout/AppTok/AppRouterTok";
import NavBar from "./layout/AppTok/NavBar";

import "bootstrap/dist/css/bootstrap.min.css";

const AppTok = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <AppRouterTok />
    </BrowserRouter>
  );
};

export default AppTok;
