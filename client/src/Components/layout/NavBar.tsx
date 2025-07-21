// ^ панель навигации
import { observer } from "mobx-react-lite";
import { useContext, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";

// константы/контекст
import {
  ABOUTME_ROUTE,
  ADMIN_ROUTE,
  BASKET_ROUTE,
  CONTACTS_ROUTE,
  DELIVERY_ROUTE,
  LOGIN_ROUTE,
  USER_ROUTE,
} from "@/utils/consts";
import { AppContext } from "@/context/AppContext";

const NavBar = observer(() => {
  const { user, basket } = useContext(AppContext);

  // масс.маршрутов с путями,меткой,доступом
  const navItems = useMemo(
    () => [
      {
        path: user.isAuth ? USER_ROUTE : LOGIN_ROUTE,
        label: user.isAuth ? "ЛК" : "Войти",
        show: true,
      },
      {
        path: BASKET_ROUTE,
        label: (
          <> Корзина {basket.count > 0 && <span>({basket.count})</span>} </>
        ),
        show: user.isAuth,
      },
      { path: DELIVERY_ROUTE, label: "Доставка", show: true },
      { path: CONTACTS_ROUTE, label: "Контакты", show: true },
      {
        path: ABOUTME_ROUTE,
        label: "обо мне",
        show: user.hasRole("USER", 1),
      },
      {
        path: ADMIN_ROUTE,
        label: "admin панель",
        show: user.hasRole("ADMIN", 4),
      },
    ],
    [user.isAuth, basket.count]
  );

  return (
    <>
      {navItems
        .filter((item) => item.show)
        .map((item) => (
          <span key={item.path} className="menu-top__items m-t-items">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `m-t-items__navlink ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          </span>
        ))}
      {/* </nav> */}
    </>
  );
});

export default NavBar;
