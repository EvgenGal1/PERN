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
    const fetchData = async () => {
      try {
        const { userData, activated } = await authAPI.check();
        if (userData) user.login(userData);
        if (activated) user.isActivated(activated);
      } catch (error) {
        console.error("Ошибка загрузки данных пользователя:", error);
      } finally {
        setLoading(false);
      }
    };
    if (!user.isAuth) {
      fetchData();
    }
  }, [user.isAuth]);

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
