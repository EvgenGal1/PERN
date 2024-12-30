import React from "react";
import ReactDOM from "react-dom/client";

// ^ СЛИЯНИЕ (СЛН. НОВЫЙ ПОДХОД)
import AppTok from "./Components/AppTok";
import { AppContextProvider } from "./Components/layout/AppTok/AppContext";
// перехвата ошб.в дочер.Комп.
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppContextProvider>
        <AppTok />
      </AppContextProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
