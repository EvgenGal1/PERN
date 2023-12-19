// ^ панель навигации
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Navbar, Nav } from "react-bootstrap";

// хук для вывода Доп.Меню ч/з Опред.Кобин.Клвш.
import { useAllKeysPress } from "../../../scripts/hooks/useAllKeysPress";
// переключатель видимости Доп.Меню
import { Switcher1btn } from "../../ui/switcher/Switcher1btn";

// переключатель черно-белый
import { Switcher2btn } from "../../ui/switcher/Switcher2btn";

// хук для Цветовых Тем (Тёмная/Сетлая/Средняя)
import { useTheme } from "../../../scripts/hooks/useTheme";
// переключатель для Цв.Тем
import { Switcher3btn } from "../../ui/switcher/Switcher3btn";

// хук для Размеров (Большой, Средний, Маленький,Выключен)
import { useSize } from "../../../scripts/hooks/useSize";
// переключатель для размеров
import { Switcher4btn } from "../../ui/switcher/Switcher4btn";

// подсказка по наведению мыши
import { TitleEl } from "../../ui/hintTemplates/TitleEl";

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

  // ЛОГИКА Опред.Комбин.Клвш. для вывода Доп.Меню
  const saved = localStorage.getItem("--dopMenu");
  const [pressCombine, setPressCombine] = useState(
    saved ? JSON.parse(saved) : false
  );

  // массив букв после хука (возвращ true е/и переданные и нажатые равны)
  const combinePress = useAllKeysPress({
    userKeys: ["d", "o", "p", "m", "n"],
    order: true,
  });
  //  ----------------------------------------------------------------------------------
  const combinePress_2 = useAllKeysPress({
    userKeys: ["d", "m", "n"],
    order: true,
  });
  //  ----------------------------------------------------------------------------------

  // отслеж. измен.с записью в LS
  useEffect(() => {
    if (combinePress === true) {
      setPressCombine((prevState: any) => !prevState);
      localStorage.setItem("--dopMenu", JSON.stringify(true));
      if (pressCombine) localStorage.removeItem("--dopMenu");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combinePress /* , pressCombine */]);

  useEffect(() => {
    if (combinePress_2 === true && user?.isAuth) {
      setPressCombine(false);
      localStorage.removeItem("--dopMenu");
    }
  }, [combinePress_2, user?.isAuth]);

  // сост. подсказки по наведению мыши
  const [isHovering, setIsHovering] = useState("");
  useEffect(() => {}, [isHovering]);

  // подкл. логики переключателя Цветовых Тем (dark/light/natural)
  useTheme();

  // подкл. логики переключателя Размеров (big/mid/small/off)
  useSize();

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
