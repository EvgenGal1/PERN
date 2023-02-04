import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./project/App";
import Store from "./store/store";

interface StoreSt {
  store: Store;
}

const store = new Store();

export const Context = createContext<StoreSt>({
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
