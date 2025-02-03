import React from "react";
import ReactDOM from "react-dom/client";

// основ.прилож.
import App from "./App";
// контекст приложения (умолчание/настройка/доп.)
import { AppContextProvider } from "./Components/layout/AppTok/AppContext";
// перехватчик ошб.в дочер.Комп.
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
