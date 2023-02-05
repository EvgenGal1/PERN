import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./project/App";
import StoreTS from "./project/client/src/store/storeTS";

// inrf для полей контекста
interface intrfStoreTS {
  store: StoreTS;
}

// объ.экземпл.кл.
const store = new StoreTS();

// созд.Context для использ.store в комп.ч/з useContext
export const Context = createContext<intrfStoreTS>({
  store,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Context.Provider value={{ store }}>
      <App />
    </Context.Provider>
  </React.StrictMode>
);
