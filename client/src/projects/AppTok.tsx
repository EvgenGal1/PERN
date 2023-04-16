import React from "react";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "../Components/layout/AppTok/AppRouterNew";
import NavBar from "../Components/layout/AppTok/NavBar";

import "bootstrap/dist/css/bootstrap.min.css";

const AppTok = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
};

export default AppTok;
