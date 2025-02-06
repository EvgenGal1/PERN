// использ.зависимости/пакеты
import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";

// окружение/API
import { AppContext } from "./Components/layout/AppTok/AppContext";
import { authAPI } from "./api/auth/authAPI";
// гл.Компоненты
import { Header } from "./Components/layout/Header";
import NavBar from "./Components/layout/AppTok/NavBar";
import AppRouterTok from "./Components/layout/AppTok/AppRouterTok";
import { Footer } from "./Components/layout/Footer";
// доп.Комп.
import Loader from "./Components/layout/AppTok/Loader";
// стили
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.scss";

const AppTok: React.FC = observer(() => {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { userData, activated } = await authAPI.check();
        if (userData) user.login(userData);
        if (activated) user.isActivated(activated);
      } catch (error) {
        console.error("Ошибка загрузки данных пользователя:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
