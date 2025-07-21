// использ.зависимости/пакеты
import { observer } from "mobx-react-lite";
import { Suspense, useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

// окружение/API
import AppRouter from "@Comp/layout/AppRouter";
import { AppContext } from "@/context/AppContext";
// гл.Компоненты
import Footer from "@Comp/layout/Footer";
import Header from "@Comp/layout/Header";
// доп.Комп.
import LoadingAtom from "./Components/ui/loader/LoadingAtom";
// стили
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/styles.scss";

const App: React.FC = observer(() => {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initialize = async () => {
      // попытка восстановить сессию
      await user.restoreSession();
      setLoading(false);
    };
    initialize();
  }, []);

  // показ LoadingAtom, при загр.данн.польз.с БД
  if (loading) return <LoadingAtom />;

  return (
    <BrowserRouter>
      <Header />
      {/* Минимизация запросов */}
      <Suspense fallback={<LoadingAtom />}>
        <AppRouter />
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
});

export default App;
