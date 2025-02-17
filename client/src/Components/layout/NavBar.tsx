// ^ панель навигации
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

// хук для вывода Доп.Меню ч/з Опред.Кобин.Клвш.
import { useAllKeysPress } from "@/scripts/hooks/useAllKeysPress";
// хук для Цветовых Тем (Тёмная/Сетлая/Средняя)
import { useTheme } from "@/scripts/hooks/useTheme";
// хук для Размеров (Большой, Средний, Маленький,Выключен)
import { useSize } from "@/scripts/hooks/useSize";
// константы/контекст
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  CONTACTS_ROUTE,
  DELIVERY_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  SHOP_ROUTE,
  USER_ROUTE,
} from "@/utils/consts";
import { AppContext } from "@/context/AppContext";

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
  }, [combinePress /* , pressCombine */]);

  useEffect(() => {
    if (combinePress_2 === true && user?.isAuth) {
      setPressCombine(false);
      localStorage.removeItem("--dopMenu");
    }
  }, [combinePress_2, user?.isAuth]);

  // сост. подсказки по наведению мыши
  // const [isHovering, setIsHovering] = useState("");
  // useEffect(() => {}, [isHovering]);

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
              <NavLink to={REGISTER_ROUTE} className="nav-link">
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
