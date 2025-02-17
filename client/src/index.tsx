import React from "react";
import ReactDOM from "react-dom/client";

// основ.прилож.
import App from "@/App";
// контекст приложения (умолчание/настройка/доп.)
import { AppContextProvider } from "@/context/AppContext";
// перехватчик ошб.в дочер.Комп.
import ErrorBoundary, {
  FallbackComp,
} from "@/Components/ErrorBoundary/ErrorBoundary";
import { ApiError } from "@/utils/errorClasses";

import "@/index.css";

// подкл.логг. Sentry ()
// Sentry.init({
//   dsn: process.env.REACT_APP_SENTRY_DSN,
//   environment: process.env.NODE_ENV,
// });

// глобал.UI отката (fallback UI) от кретич.ошб.рендера
const GlobalFallback: FallbackComp = ({
  error,
  onReset,
}: {
  error?: ApiError;
  onReset?: () => void;
}) => (
  <div className="global-error auth-error">
    <h1>Критическая ошибка</h1>
    <p>Приносим извинения за неудобства</p>
    <div className="error-details">
      <p>Сообщение: {error?.message}</p>
      <p>Код: {error?.code}</p>
    </div>
    <button className="reload-button" onClick={onReset}>
      Перезагрузить приложение
    </button>
  </div>
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ErrorBoundary
      // заклушка UI > отката при ошб.
      FallbackComp={GlobalFallback}
    >
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
