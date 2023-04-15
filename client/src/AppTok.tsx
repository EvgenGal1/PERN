import React from "react";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "./Components/layout/AppRouter";
import NavBar from "./Components/layout/NavBar";

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
