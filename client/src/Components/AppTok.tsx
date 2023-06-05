import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";
import axios from "axios";

import { AppContext } from "./layout/AppTok/AppContext";
import AppRouterTok from "./layout/AppTok/AppRouterTok";
import NavBar from "./layout/AppTok/NavBar";
import { check as checkAuth } from "../http/Tok/userAPI_Tok";
import { fetchBasket } from "../http/Tok/basketAPI_Tok";
import Loader from "./layout/AppTok/Loader";

import "bootstrap/dist/css/bootstrap.min.css";

const AppTok = observer(() => {
  const { user, basket }: any = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  // const [userAuthLoading, setUserAuthLoading] = useState(true);
  // const [basketLoading, setBasketLoading] = useState(true);

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
    Promise.all([checkAuth(), fetchBasket()])
      .then(
        axios.spread((userData, basketData) => {
          if (userData) {
            user.login(userData);
          }
          basket.products = basketData.products;
        })
      )
      .finally(() => setLoading(false));
  }, []);

  // показываем loader, пока получаем с сервера данн. пользователя и корзины
  if (loading /* userAuthLoading || basketLoading */) {
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
