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
  const { user, basket, order }: any = useContext(AppContext);
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
    // ! исправить. созд. корзину(2 на dev ?) при перв.загр. даже без польз
    Promise.all([
      checkUser(),
      // ^ убрал созд.Basket при загр.стр.
      // ! есть - мигание пустой корзины, т.к. загр.данн. идём в комп. Корзины.
      // ^ решил - использ.доп.условн.рендер (fetching)
      // fetchBasket()
    ])
      .then(
        axios.spread((data: /* userData */ /* , basketData */ any) => {
          // запись user и activLink в Store
          if (data.userData) user.login(data.userData);
          if (data.activLink) user.activationLink(data.activLink);
          // basket.products = basketData.products;
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
