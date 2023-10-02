import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AppContext } from "../../layout/AppTok/AppContext";
import { USERORDER_ROUTE } from "../../../utils/consts";
import { logoutUser } from "../../../http/Tok/userAPI_Tok";

const User = () => {
  const { user }: any = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = (event: any) => {
    logoutUser();
    user.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="container">
      <div className="user us">
        <section className="us--hello hello">
          <h1>Личный кабинет {user?.name && <p>Клиента {user?.name}</p>}</h1>
          {/* <p>Это личный кабинет постоянного покупателя магазина</p> */}
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
            onClick={() => navigate(USERORDER_ROUTE)}
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
