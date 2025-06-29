// использ.зависимости/пакеты
import { observer } from "mobx-react-lite";
import { Suspense, useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

// окружение/API
import AppRouter from "@Comp/layout/AppRouter";
import { AppContext } from "@/context/AppContext";
import { authAPI } from "@/api/auth/authAPI";
// гл.Компоненты
import Footer from "@Comp/layout/Footer";
import Header from "@Comp/layout/Header";
// доп.Комп.
import Loader from "@Comp/ui/loader/Loader";
// стили
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/styles.scss";

const App: React.FC = observer(() => {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // проверка наличия Токена в LS
    const tokenAccess = localStorage.getItem("tokenAccess") ?? "";
    const fetchData = async () => {
      try {
        // восстановление сессии если есть Токен в LS
        if (tokenAccess) {
          const isSessionRestored = await user.restoreSession(tokenAccess);
          if (!isSessionRestored) {
            setLoading(false);
            return;
          }
        }

        // API проверка Токена Пользователя е/и нет сессии
        const { userData, activated } = await authAPI.check();
        if (userData && userData.id) {
          user.login({ ...userData, isActivated: activated });
        }
      } catch (error: unknown) {
        console.error("Ошибка восстановления сессии Пользователя:", error);
      } finally {
        setLoading(false);
      }
    };

    // вызов данн.Пользователя если не Авторизован
    if (tokenAccess && !user.isAuth) fetchData();
    else setLoading(false);
  }, []);

  // показ Loader, при загр.данн.польз.с БД
  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <Header />
      {/* Минимизация запросов */}
      <Suspense fallback={<Loader />}>
        <AppRouter />
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
});

export default App;
