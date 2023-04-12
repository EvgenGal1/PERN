import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./projects/App";
import "./index.css";

// ^ NRJWT
import StoreTS from "./projects/client/src/store/storeTS";
// inrf для полей контекста
interface intrfStoreTS {
  store: StoreTS;
}
// объ.экземпл.кл.
const store = new StoreTS();
// созд.Context для использ.store в комп.ч/з useContext
// export const Context = createContext({ store });
export const Context = createContext<intrfStoreTS>({
  store,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // ^ ДО слияния tokmakov|UlbiTV
  // <React.StrictMode>
  //   <Context.Provider value={{ store }}>
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>
  //   </Context.Provider>
  // </React.StrictMode>
  // ^ слияние tokmakov|UlbiTV. НОВЫЙ ПОДХОД
  <React.StrictMode>
    <Context.Provider value={{ store }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Context.Provider>
  </React.StrictMode>
);
