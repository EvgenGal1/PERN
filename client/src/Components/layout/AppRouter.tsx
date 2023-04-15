import React, { useContext } from "react";
import { Routes, Route /* , Redirect */ } from "react-router-dom";
import { publicRoutes, authRoutes, adminRoutes } from "../../routes";
// ^ tokmakov.blog
import { AppContext } from "./AppContext";
// ^ UlbiTV.PERN.magaz
// import { SHOP_ROUTE } from "../utils/consts";
import { ContextUTVst } from "../../index";
// import {observer} from "mobx-react-lite";

// !!! https://tokmakov.blog.msk.ru/blog/item/677 разобрать примеры и 673
// const AppRouter = observer(() => {
const AppRouter = () => {
  // врем заглушка.
  const isAuth = true;
  const isAdmin = true;
  const { user }: any = useContext(AppContext);

  // ^ UlbiTV.PERN.magaz
  const { userUTV }: any = useContext(ContextUTVst);

  //     console.log(user)
  return (
    // Routes(Switch) отраб.последний маршр. е/и ни один не корректен
    <Routes>
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
      {
        /* user. */ isAdmin &&
          adminRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))
      }

      {/* // ! прописать отд. ТфмИфк и AppRouter для AppUTV */}
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

export default AppRouter;
