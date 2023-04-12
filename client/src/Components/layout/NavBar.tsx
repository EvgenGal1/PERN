import React, { useContext } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  SHOP_ROUTE,
  DELIVERY_ROUTE,
  CONTACTS_ROUTE,
  LOGIN_ROUTE,
  USER_ROUTE,
  ADMIN_ROUTE,
} from "../../utils/consts";
// ^ tokmakov.blog
import { AppContext } from "./AppContext";
// ^ UlbiTV.PERN.magaz
// import { Context } from "../index";
// import {observer} from "mobx-react-lite";
// import { useHistory } from "react-router-dom";

const NavBar = /* observer( */ () => {
  // врем заглушка.
  // const isAuth = true;
  // const isAdmin = true;
  const { user } = useContext(AppContext);

  // ^ UlbiTV.PERN.magaz
  // const { user } = useContext(Context);
  // const history = useHistory();
  // const logOut = () => {
  //   user.setUser({});
  //   user.setIsAuth(false);
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
          {user.isAuth ? (
            <>
              <NavLink to={USER_ROUTE} className="nav-link">
                Личный кабинет
              </NavLink>
              <Button
                variant={"outline-light"}
                // onClick={() => history.push(ADMIN_ROUTE)}
              >
                Админ панель
              </Button>
              <Button
                variant={"outline-light"}
                // onClick={() => logOut()}
                className="ml-2"
              >
                Выйти
              </Button>
            </>
          ) : (
            <>
              <NavLink to={LOGIN_ROUTE} className="nav-link">
                Войти
              </NavLink>
              <Button
                variant={"outline-light"}
                // onClick={() => history.push(LOGIN_ROUTE)}
              >
                Авторизация
              </Button>
            </>
          )}
          {/* Админ */}
          {user.isAdmin && (
            <>
              <NavLink to={ADMIN_ROUTE} className="nav-link">
                Панель управления
              </NavLink>
              <Button
                variant={"outline-light"}
                // onClick={() => history.push(ADMIN_ROUTE)}
              >
                Админ панель
              </Button>
            </>
          )}
        </Nav>

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
              onClick={() => history.push(LOGIN_ROUTE)}
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
