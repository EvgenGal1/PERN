import React, { useContext, useMemo, Suspense } from "react";
import { Routes, Route /* , Redirect */, useLocation } from "react-router-dom";

import { publicRoutes, authRoutes, adminRoutes } from "./routes";
import { AppContext } from "../../context/AppContext";
// import { SHOP_ROUTE } from "../utils/consts";
// import { Context } from "../index";
// import {observer} from "mobx-react-lite";

// аним ч/з react-spring. выбор изза возможности в родителе откр. стр.дочки
import { useTransition, animated } from "react-spring";
import Loader from "../ui/loader/Loader";

// !!! https://tokmakov.blog.msk.ru/blog/item/677 разобрать примеры и 673
// const AppRouterStar = observer(() => {
const AppRouter: React.FC = () => {
  const { user }: any = useContext(AppContext);

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

  // ^
  // const renderRoutes = () => {
  //   const routes = [...publicRoutes];
  //   if (user?.isAuth) {
  //     routes.push(...authRoutes);
  //   }
  //   if (user?.isAdmin) {
  //     routes.push(...adminRoutes);
  //   }
  //   return routes.map(({ path, Component }) => (
  //     <Route key={path} path={path} element={<Component />} />
  //   ));
  // };
  // return (
  //   <main className="main">
  //     <Routes>{renderRoutes()}</Routes>
  //   </main>
  // );

  const routes = useMemo(
    // Мемоизация маршрутов
    () => [
      ...publicRoutes,
      ...(user.isAuth ? authRoutes : []),
      ...(user.isAdmin ? adminRoutes : []),
    ],
    [user.isAuth, user.isAdmin]
  );

  return (
    <>
      {/* {transitions((props, item) => (
        <animated.main className="main " style={props}> */}

      <main className="main">
        <Routes /* location={item} */>
          {/* // ^ */}
          {/* Маршруты с общим каркасом Layout */}
          {/* <Route element={<Layout />}> */}
          {/* // ^ tokmakov.blog */}
          {/* {publicRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          {user.isAuth &&
            authRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          {user.isAdmin &&
            adminRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))} */}
          {/* // ^ UlbiTV.PERN.magaz +++ */}
          {/* <Redirect to={SHOP_ROUTE} /> */}
          {/* </Route> */}
          {/* // ^ оптимиз.код */}
          {routes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={
                // <Component />
                //  Suspense для ленивой загрузки
                // ? откуда и зачем Suspense и Loader
                <Suspense fallback={<Loader />}>
                  <Component />
                </Suspense>
              }
            />
          ))}
        </Routes>
      </main>
      {/* 
        </animated.main> 
      ))}
      */}
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

export default AppRouter;
