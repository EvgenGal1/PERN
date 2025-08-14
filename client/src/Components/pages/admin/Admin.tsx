import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authAPI } from "@/api/auth/authAPI";
import {
  ADMINBRANDS_ROUTE,
  ADMINCATEGORIES_ROUTE,
  ADMINORDERS_ROUTE,
  ADMINPRODUCTS_ROUTE,
  LOGIN_ROUTE,
} from "@/utils/consts";
import { AppContext } from "@/context/AppContext";

const Admin = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    user.logout();
    navigate(LOGIN_ROUTE, { replace: true });
  };

  return (
    <div className="container">
      <h1>Панель управления</h1>
      <p>Это панель управления магазином для администратора</p>
      <ul>
        <li>
          <Link to={ADMINORDERS_ROUTE}>Заказы в магазине</Link>
        </li>
        <li>
          <Link to={ADMINCATEGORIES_ROUTE}>Категории каталога</Link>
        </li>
        <li>
          <Link to={ADMINBRANDS_ROUTE}>Бренды каталога</Link>
        </li>
        <li>
          <Link to={ADMINPRODUCTS_ROUTE}>Продукты каталога</Link>
        </li>
      </ul>
      <button onClick={handleLogout} className="btn--eg btn-primary--eg">
        Выйти
      </button>
    </div>
  );
};

export default Admin;
