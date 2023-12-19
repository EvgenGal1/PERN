import React from "react";
import ReactDOM from "react-dom/client";

// ^ СЛИЯНИЕ (СЛН. НОВЫЙ ПОДХОД)
import AppTok from "./Components/AppTok";
import { AppContextProvider } from "./Components/layout/AppTok/AppContext";

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <AppTok />
    </AppContextProvider>
  </React.StrictMode>
);
