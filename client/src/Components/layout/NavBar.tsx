// ^ панель навигации
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";

// константы/контекст
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  CONTACTS_ROUTE,
  DELIVERY_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  USER_ROUTE,
} from "@/utils/consts";
import { AppContext } from "@/context/AppContext";

const NavBar = observer(() => {
  const { user, basket }: any = useContext(AppContext);

  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;

  return (
    <>
      {/* общ.меню */}
      <span className="menu-top__items m-t-items">
        <NavLink to={DELIVERY_ROUTE} className="m-t-items__navlink">
          Доставка
        </NavLink>
      </span>
      <span className="menu-top__items m-t-items">
        <NavLink to={CONTACTS_ROUTE} className="m-t-items__navlink">
          Контакты
        </NavLink>
      </span>
      {/* Авториз */}
      <span className="menu-top__items m-t-items">
        {user.isAuth ? (
          <NavLink to={USER_ROUTE} className="m-t-items__navlink">
            ЛК
          </NavLink>
        ) : (
          <NavLink
            to={isLogin ? LOGIN_ROUTE : REGISTER_ROUTE}
            className="m-t-items__navlink"
          >
            Входите
          </NavLink>
        )}
      </span>
      {/* Админ */}
      {user.isAdmin && (
        <span className="menu-top__items m-t-items">
          <NavLink to={ADMIN_ROUTE} className="m-t-items__navlink">
            Панель управления
          </NavLink>
        </span>
      )}
      {/* корзина */}
      {user.isAuth && (
        <span className="menu-top__items m-t-items">
          <NavLink to={BASKET_ROUTE} className="m-t-items__navlink">
            Корзина
            {!!basket.count && <span>({basket.count})</span>}
          </NavLink>
        </span>
      )}
    </>
  );
});

export default NavBar;
