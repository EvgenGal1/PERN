import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AppContext } from "../../layout/AppTok/AppContext";
import {
  LOGIN_ROUTE,
  ADMINORDER_ROUTE,
  ADMINCATEGORIES_ROUTE,
  ADMINBRANDS_ROUTE,
  ADMINPRODUCTS_ROUTE,
} from "../../../utils/consts";
import { logoutUser } from "../http/../../../http/Tok/userAPI_Tok";

const Admin = () => {
  const { user }: any = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = (event: any) => {
    logoutUser();
    user.logout();
    navigate(LOGIN_ROUTE, { replace: true });
  };

  return (
    <div className="container">
      <h1>Панель управления</h1>
      <p>Это панель управления магазином для администратора</p>
      <ul>
        <li>
          <Link to={ADMINORDER_ROUTE}>Заказы в магазине</Link>
        </li>
        <li>
          <Link to={ADMINCATEGORIES_ROUTE}>Категории каталога</Link>
        </li>
        <li>
          <Link to={ADMINBRANDS_ROUTE}>Бренды каталога</Link>
        </li>
        <li>
          <Link to={ADMINPRODUCTS_ROUTE}>Товары каталога</Link>
        </li>
      </ul>
      <button onClick={handleLogout} className="btn--eg btn-primary--eg">
        Выйти
      </button>
    </div>
  );
};

export default Admin;
