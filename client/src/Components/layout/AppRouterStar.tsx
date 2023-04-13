import React, { useContext } from "react";
import { Routes, Route /* , Redirect */ } from "react-router-dom";
import { publicRoutes, authRoutes /* , adminRoutes */ } from "./Router";
// ^ tokmakov.blog
import { AppContext } from "./AppContext";
// ^ UlbiTV.PERN.magaz
// import { SHOP_ROUTE } from "../utils/consts";
// import { Context } from "../index";
// import {observer} from "mobx-react-lite";

// !!! https://tokmakov.blog.msk.ru/blog/item/677 разобрать примеры и 673
// const AppRouterStar = observer(() => {
const AppRouterStar = () => {
  // врем заглушка.
  // const isAuth = false;
  // const isAdmin = true;
  const { user }: any = useContext(AppContext);

  //     console.log(user)
  return (
    // Routes(Switch) отраб.последний маршр. е/и ни один не корректен
    <Routes>
      {/* // ^ tokmakov.blog */}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      {user.isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {/* {user.isAdmin &&
        adminRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))} */}

      {/* // ^ UlbiTV.PERN.magaz */}
      {/* {
        user. isAuth &&
          authRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} component={Component} exact />
          ))
      }
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} component={Component} exact />
      ))} */}
      {/* <Redirect to={SHOP_ROUTE} /> */}
    </Routes>
  );
};
// );

export default AppRouterStar;
