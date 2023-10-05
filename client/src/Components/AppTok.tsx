import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";
import axios from "axios";

import { AppContext } from "./layout/AppTok/AppContext";
import AppRouterTok from "./layout/AppTok/AppRouterTok";
import NavBar from "./layout/AppTok/NavBar";
import { checkUser } from "../http/Tok/userAPI_Tok";
import Loader from "./layout/AppTok/Loader";

import "bootstrap/dist/css/bootstrap.min.css";

const AppTok = observer(() => {
  const { user /* , basket */ }: any = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // checkAuth()
    //   .then((data) => {
    //     if (data) {
    //       user.login(data);
    //     }
    //   })
    //   .finally(() => setUserAuthLoading(false));
    // fetchBasket()
    //   .then((data) => (basket.products = data.products))
    //   .finally(() => setBasketLoading(false));
    // ^ Promise.all() Запускаем несколько промисов(здесь два) параллельно и ждём, выполнения (получ.данн.с сервера)
    Promise.all([
      checkUser(),
      // убрал созд.Basket при загр.Глав.стр.
      // fetchBasket()
    ])
      .then(
        axios.spread((data: /* userData */ /* , basketData */ any) => {
          console.log("AppTok data ", data);
          // запись user и activated в Store
          if (data.userData) user.login(data.userData);
          if (data.activated) user.isActivated(data.activated);
          // basket.products = basketData.products;
        })
      )
      .finally(() => setLoading(false));
  }, [user]);

  // показываем loader, пока получаем с сервера данн. пользователя
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
