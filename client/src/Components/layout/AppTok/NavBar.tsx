// ^ панель навигации
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import {
  SHOP_ROUTE,
  DELIVERY_ROUTE,
  CONTACTS_ROUTE,
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  BASKET_ROUTE,
  USER_ROUTE,
  ADMIN_ROUTE,
} from "../../../utils/consts";
import { AppContext } from "./AppContext";

const NavBar = observer(() => {
  const { user, basket }: any = useContext(AppContext);

  console.log("NavBar basket.count ", basket.count);
  return (
    <Navbar bg="dark" variant="dark">
      <div className="container">
        {/* // ^ tokmakov.blog + СВОЁ  */}
        {/* магаз */}
        <NavLink to={SHOP_ROUTE} className="navbar-brand">
          Магаз
        </NavLink>
        {/* общ.меню */}
        <Nav className="ml-auto" style={{ color: "white" }}>
          <NavLink to={DELIVERY_ROUTE} className="nav-link">
            Доставка
          </NavLink>
          <NavLink to={CONTACTS_ROUTE} className="nav-link">
            Контакты
          </NavLink>
          {/* Авториз */}
          {user.isAuth ? (
            <>
              <NavLink to={USER_ROUTE} className="nav-link">
                Личный кабинет
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to={LOGIN_ROUTE} className="nav-link">
                Войти
              </NavLink>
              <NavLink to={SIGNUP_ROUTE} className="nav-link">
                Регистрация
              </NavLink>
            </>
          )}
          {/* Админ */}
          {user.isAdmin && (
            <>
              <NavLink to={ADMIN_ROUTE} className="nav-link">
                Панель управления
              </NavLink>
            </>
          )}
          <NavLink to={BASKET_ROUTE} className="nav-link">
            Корзина
            {!!basket.count && <span>({basket.count})</span>}
          </NavLink>
        </Nav>
      </div>
    </Navbar>
  );
});

export default NavBar;
