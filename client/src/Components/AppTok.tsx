import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { AppContext } from "./layout/AppTok/AppContext";
import AppRouterTok from "./layout/AppTok/AppRouterTok";
import NavBar from "./layout/AppTok/NavBar";
import { check as checkAuth } from "../http/Tok/userAPI_Tok";
import Loader from "./layout/AppTok/Loader";

import "bootstrap/dist/css/bootstrap.min.css";

const AppTok = observer(() => {
  const { user }: any = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth()
      .then((data) => {
        if (data) {
          user.login(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // показываем loader, пока получаем с сервера данные пользователя
  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouterTok />
    </BrowserRouter>
  );
});

export default AppTok;
