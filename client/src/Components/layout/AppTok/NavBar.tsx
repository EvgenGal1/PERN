// ^ панель навигации
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import {
  SHOP_ROUTE,
  DELIVERY_ROUTE,
  CONTACTS_ROUTE,
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  UTV_LOGIN_ROUTE,
  UTV_REGISTRATION_ROUTE,
  BASKET_ROUTE,
  BASKET_UTVst_ROUTE,
  USER_ROUTE,
  ADMIN_ROUTE,
} from "../../../utils/consts";
import { AppContext } from "./AppContext";
import CheckAuth from "./CheckAuth";
import FetchBasket from "./FetchBasket";

const NavBar = observer(() => {
  // врем заглушка.
  // const isAuth = false;
  // const isAdmin = true;
  const { user, basket }: any = useContext(AppContext);

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
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
          {/* показ.loader до авториз. или не авториз.е/и токена нет/истёк */}
          <CheckAuth>
            {/* Авториз */}
            {user.isAuth ? (
              <>
                <NavLink to={USER_ROUTE} className="nav-link">
                  Личный кабинет
                </NavLink>
                {/* <NavLink to={BASKET_ROUTE} className="nav-link">
                  Корзина
                </NavLink> */}
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
          </CheckAuth>
          {/* Когда пользователь только зашел на сайт — надо запросить с сервера его корзину, если она существует. И показывать в главном меню ссылку на корзину + количество позиций в ней. Для этого создадим HOC-компонент FetchBasket.js и обернем в него ссылку на корзину. */}
          <FetchBasket>
            <NavLink to={BASKET_ROUTE} className="nav-link">
              Корзина
              {!!basket.count && <span>({basket.count})</span>}
            </NavLink>
          </FetchBasket>
        </Nav>
      </Container>
    </Navbar>
  );
});

export default NavBar;
