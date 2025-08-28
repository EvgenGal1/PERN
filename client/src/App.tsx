// использ.зависимости/пакеты
import { observer } from "mobx-react-lite";
import { Suspense, useContext, useEffect, useMemo, useState } from "react";
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

import { useCommandListener } from "./scripts/hooks/useCommandListener";
import { AvailableCommands } from "./types/user.types";

const App: React.FC = observer(() => {
  const { user, basket } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        // попытка восстановить сессию
        const sessionRestored = await user.restoreSession();
        // после востанов.user загр.basket
        if (sessionRestored) await basket.loadBasket();
      } catch (error) {
        console.error("App в ошб. Инициализации:", error);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  /** созд.список кмд.из UserStore. Зависит от внутр.данн.user */
  const commandConfigs: AvailableCommands[] = useMemo(() => {
    // проверка авторизации и команд
    if (user.isAuth !== true || user.availableCommands.length === 0) {
      console.log("[useCommands] нет Авторизации или Команды");
      return [];
    }

    // преобраз.кмд.в config > useCommandListener
    return user.availableCommands.map((command: AvailableCommands) => ({
      name: command.name,
      keys: command.keys,
      type: command.type,
    }));
  }, [user?.isAuth, user?.availableCommands]);

  // подкл.слушатель клавиш с передачей списка кмд.пользователя и обработчик кмд.
  useCommandListener({ commands: commandConfigs });

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
