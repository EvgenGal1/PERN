import React, { useContext } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  SHOP_ROUTE,
  DELIVERY_ROUTE,
  CONTACTS_ROUTE,
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  UTV_LOGIN_ROUTE,
  UTV_REGISTRATION_ROUTE,
  USER_ROUTE,
  ADMIN_ROUTE,
} from "../../utils/consts";
// ^ tokmakov.blog
import { AppContext } from "./AppContext";
// ^ UlbiTV.PERN.magaz
import { ContextUTVst } from "../../index";
// import {observer} from "mobx-react-lite";
import { /* useHistory */ useNavigate } from "react-router-dom";

const NavBar = /* observer( */ () => {
  // врем заглушка.
  const isAuth = false;
  const isAdmin = true;
  const { user } = useContext(AppContext);

  // ^ UlbiTV.PERN.magaz
  // const { userUTV }: any = useContext(ContextUTVst);
  // const history = /* useHistory */ useNavigate();
  // const logOut = () => {
  //   userUTV.setUser({});
  //   userUTV.setIsAuth(false);
  // };

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
          {/* Авториз */}
          {
            /* user. */ isAuth ? (
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
            )
          }
          {/* Админ */}
          {
            /* user. */ isAdmin && (
              <>
                <NavLink to={ADMIN_ROUTE} className="nav-link">
                  Панель управления
                </NavLink>
              </>
            )
          }
        </Nav>

        {/* // ! прописать отд. ТфмИфк и AppRouter для AppUTV */}
        {/* // ^ UlbiTV.PERN.magaz */}
        {/* {user.isAuth ? (
          <Nav className="ml-auto" style={{ color: "white" }}>
            <Button
              variant={"outline-light"}
              onClick={() => history.push(ADMIN_ROUTE)}
            >
              Админ панель
            </Button>
            <Button
              variant={"outline-light"}
              onClick={() => logOut()}
              className="ml-2"
            >
              Выйти
            </Button>
          </Nav>
        ) : (
          <Nav className="ml-auto" style={{ color: "white" }}>
            <Button
              variant={"outline-light"}
              onClick={() => history.push(UTV_LOGIN_ROUTE)}
            >
              Авторизация
            </Button>
          </Nav>
        )} */}
      </Container>
    </Navbar>
  );
}; /* ) */

export default NavBar;
