// использ.зависимости/пакеты
import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";
import axios from "axios";
// окружение/API
import { AppContext } from "./layout/AppTok/AppContext";
import { checkUser } from "../http/Tok/userAPI_Tok";
// гл.Компоненты
import { Header } from "./layout/Header";
import NavBar from "./layout/AppTok/NavBar";
import AppRouterTok from "./layout/AppTok/AppRouterTok";
import { Footer } from "./layout/Footer";
// доп.Комп.
import Loader from "./layout/AppTok/Loader";
// стили
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/styles.scss";

const AppTok: React.FC = observer(() => {
  const { user /* , basket */ }: any = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ^ Promise.all() Запуск.неск.промисов(здесь два) параллельно и ждём выполнения (получ.данн.с сервера)
    Promise.all([
      checkUser(),
      // ^ убрал созд.Basket при загр.Глав.стр.
      // fetchBasket()
    ])
      .then(
        axios.spread((data: /* userData | basketData */ any) => {
          // запись user и activated в Store
          if (data.userData) user.login(data.userData);
          if (data.activated) user.isActivated(data.activated);
          // basket.products = basketData.products;
        })
      )
      .finally(() => setLoading(false));
  }, [user]);

  // показ Loader, при загр.данн.польз.с БД
  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <Header />
      <NavBar />
      <AppRouterTok />
      <Footer />
    </BrowserRouter>
  );
});

export default AppTok;
