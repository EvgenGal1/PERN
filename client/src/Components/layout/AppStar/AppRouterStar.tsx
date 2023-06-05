import React, { useContext } from "react";
import { Routes, Route /* , Redirect */, useLocation } from "react-router-dom";

import {
  publicRoutes,
  authRoutes /* publicRoutes, authRoutes */ /* , adminRoutes */,
} from "./Router";
// ^ tokmakov.blog
// import { AppContext } from "../AppContext.js";
// ^ UlbiTV.PERN.magaz
// import { SHOP_ROUTE } from "../utils/consts";
// import { Context } from "../index";
// import {observer} from "mobx-react-lite";

// аним ч/з react-spring. выбор изза возможности в родителе откр. стр.дочки
import { useTransition, animated } from "react-spring";

// !!! https://tokmakov.blog.msk.ru/blog/item/677 разобрать примеры и 673
// const AppRouterStar = observer(() => {
const AppRouterStar = () => {
  // врем заглушка.
  const isAuth = true;
  const isAdmin = true;
  // const { user }: any = useContext(AppContext);

  // анимация страниц
  const location = useLocation();
  const transitions = useTransition(location, {
    from: {
      opacity: 0,
      transform: "translateX(100%)",
      transitionTimingFunction: "ease",
    },
    enter: {
      opacity: 1,
      transform: "translateX(0%)",
      transitionTimingFunction: "ease",
    },
    leave: {
      opacity: 0,
      transform: "translateX(-100%)",
      // transform: "scale(0.9) translateY(-100px)",
      transitionTimingFunction: "ease",
      position: "absolute",
    },
  });

  return (
    <>
      {transitions((props, item) => (
        <animated.main className="main " style={props}>
          <Routes location={item}>
            {/* // ^ tokmakov.blog */}
            {publicRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
            {
              /* user. */ isAuth &&
                authRoutes.map(({ path, Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))
            }
            {/* {user.isAdmin &&
              adminRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))} */}
            {/* // ^ UlbiTV.PERN.magaz +++ */}
            {/* <Redirect to={SHOP_ROUTE} /> */}
          </Routes>
        </animated.main>
      ))}
    </>
  );
};
//   {user.isAuth &&
//     authRoutes.map(({ path, Component }) => (
//       <Route key={path} path={path} element={<Component />} />
//     ))}
//   {/* {user.isAdmin &&
//     adminRoutes.map(({ path, Component }) => (
//       <Route key={path} path={path} element={<Component />} />
//     ))} */}

// );

export default AppRouterStar;
