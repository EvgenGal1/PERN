import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AppContext } from "../../layout/AppTok/AppContext";
import { USERORDER_ROUTE } from "../../../utils/consts";
import { logoutUser } from "../../../http/Tok/userAPI_Tok";

const User = () => {
  const { user }: any = useContext(AppContext);
  const navigate = useNavigate();
  console.log("user ", user);

  const handleLogout = (event: any) => {
    logoutUser();
    user.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="container">
      <h1>Личный кабинет {user?.name && <p>Клиента {user?.name}</p>}</h1>
      {/* <p>Это личный кабинет постоянного покупателя магазина</p> */}
      <div>
        {user?.name && <p>Имя : {user?.name}</p>}
        {user?.email && <p>Email : {user?.email}</p>}
      </div>
      <button className="btn--eg btn-primary--eg">
        {" "}
        Редактировать Пользователя
      </button>
      <button className="btn--eg btn-success--eg mt-3">
        <Link className="a0" to={USERORDER_ROUTE} replace={true}>
          История заказов
        </Link>
      </button>
      <button onClick={handleLogout} className="btn--eg btn-danger--eg mt-3">
        Выйти
      </button>
    </div>
  );
};

export default User;
