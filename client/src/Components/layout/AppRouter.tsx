import { useContext, useMemo, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { publicRoutes, authRoutes, adminRoutes } from "./routes";
import { AppContext } from "@/context/AppContext";
import LoadingAtom from "@Comp/ui/loader/LoadingAtom";

type RouteConfig = {
  path: string;
  Component: React.ComponentType;
  roles?: Array<{ role: string; level?: number }>;
};

const AppRouter: React.FC = observer(() => {
  const { user } = useContext(AppContext);

  /**
   * проверка доступа к Маршруту от Роли/Уровня Пользователя
   * @param route - конфигурация Маршрута
   * @returns boolean - true если доступ разрешен
   */
  const hasAccess = (route: RouteConfig): boolean => {
    // публичные Маршруты доступны Всем
    if (!route.roles) return true;
    // проверка требований Маршрута
    return user.hasAnyRole(route.roles);
  };

  // Маршруты с мемоизацией и фильтром Доступа
  const routes = useMemo(
    () => [
      ...publicRoutes,
      ...(user.isAuth ? authRoutes.filter((route) => hasAccess(route)) : []),
      ...(user.isAdmin ? adminRoutes.filter((route) => hasAccess(route)) : []),
    ],
    [user.isAuth, user.roles]
  );

  return (
    <main className="main">
      <div className="container">
        <Routes>
          {routes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={
                // отрис.с ленив.загр.
                <Suspense fallback={<LoadingAtom />}>
                  <Component />
                </Suspense>
              }
            />
          ))}
        </Routes>
      </div>
    </main>
  );
});

export default AppRouter;
