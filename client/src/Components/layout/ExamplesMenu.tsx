// ^ панель навигации
import { observer } from "mobx-react-lite";
import { useContext, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";

// константы/контекст
import {
  NAWPRO_ROUTE,
  PROB0_ROUTE,
  PROB1_ROUTE,
  PROB2_ROUTE,
  NRJWT_ROUTE,
} from "@/utils/constsStar";
import { AppContext } from "@/context/AppContext";

const ExamplesMenu = observer(() => {
  const { user } = useContext(AppContext);

  const navItems = useMemo(
    () => [
      { path: NAWPRO_ROUTE, label: "NewPro", show: true },
      { path: NRJWT_ROUTE, label: "NRJWT", show: true },
      {
        path: PROB0_ROUTE,
        label: " ХЗ ",
        show: user.hasRole("ADMIN", 3),
        subItems: [
          { path: PROB1_ROUTE, label: "Prob1" },
          { path: PROB2_ROUTE, label: "Prob2" },
        ],
      },
    ],
    [user]
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
                `m-t-items__navlink ${isActive ? "active" : ""} activ-prob`
              }
            >
              {item.label}
            </NavLink>
            {/* влож.пункты  */}
            {item.subItems && (
              <ul className="m-t-items__ul m-t-its-ul">
                {item.subItems.map((subItem) => (
                  <li key={subItem.path} className="m-t-its-ul__li">
                    <Link to={subItem.path}>{subItem.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </span>
        ))}
    </>
  );
});

export default ExamplesMenu;
