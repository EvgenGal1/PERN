import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { authAPI } from "../../../api/auth/authAPI";
import { LOGIN_ROUTE, USERORDERS_ROUTE } from "../../../utils/consts";
import { AppContext } from "../../layout/AppTok/AppContext";

const User = () => {
  const { user }: any = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = (/* event: any */) => {
    authAPI.logout();
    user.logout();
    navigate(LOGIN_ROUTE, { replace: true });
  };

  return (
    <div className="container">
      <div className="user us">
        <div className="form auth-form"></div>
        <section className="us--hello hello">
          <h1>
            Личный Кабинет {user?.username && <b>Клиента {user?.username}</b>}
          </h1>
          <p className="df df-jcc">
            {user.activated
              ? "Аккаунт подтверждён по почте"
              : "ПОДТВЕРДИТЕ АККАУНТ В ПОЧТЕ"}
          </p>
        </section>
        <section className="us--img img"></section>
        <section className="us--data data">
          <div>
            {user?.username && <p>Имя : {user?.username}</p>}
            {user?.email && <p>Email : {user?.email}</p>}
          </div>
        </section>
        <section className="us--cntrl cntrl">
          <button className="btn--eg btn-primary--eg">
            {" "}
            Редактировать Пользователя
          </button>
          <button
            onClick={() => navigate(USERORDERS_ROUTE)}
            className="btn--eg btn-success--eg mt-3"
          >
            История заказов
          </button>
          <button
            onClick={handleLogout}
            className="btn--eg btn-danger--eg mt-3"
          >
            Выйти
          </button>
        </section>
        <section className="us-experiment experiment mt-3">
          <h1>Эксперименты</h1>
          <details>
            <summary>Доп.инфо по чему угодно</summary>
            Дополнение открыто
          </details>
        </section>
      </div>
    </div>
  );
};

export default User;
