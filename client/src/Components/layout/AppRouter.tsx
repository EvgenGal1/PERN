import { useContext, useMemo, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { publicRoutes, authRoutes, adminRoutes } from "./routes";
import { AppContext } from "@/context/AppContext";
import Loader from "@Comp/ui/loader/Loader";
const AppRouter: React.FC = () => {
  const { user } = useContext(AppContext);

  // маршруты с мемоизацией
  const routes = useMemo(
    () => [
      ...publicRoutes,
      ...(user.isAuth ? authRoutes : []),
      ...(user.isAdmin ? adminRoutes : []),
    ],
    [user.isAuth, user.isAdmin]
  );

  return (
    <main className="main">
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={
              // отрис.с ленив.загр.
              <Suspense fallback={<Loader />}>
                <Component />
              </Suspense>
            }
          />
        ))}
      </Routes>
    </main>
  );
};

export default AppRouter;
