import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// ^ Мой Шаблон | СТАРЫЙ ПОДХОД
import { AppStar } from "./projects/AppStar";
// import { Router } from "./Components/layout/Router";
import "./index.css";
// ^ UlbiTV.PERNstore
import UserStore from "./store/UserStore";
import DeviceStore from "./store/DeviceStore";
import AppUTV from "./projects/AppUTV";
// ^ СЛИЯНИЕ (СЛН. НОВЫЙ ПОДХОД)
import AppTok from "./projects/AppTok";
import { AppContextProvider } from "./Components/layout/AppTok/AppContext";

// ^ NRJWT
import StoreTS from "./projects/client/src/store/storeTS";
// inrf для полей контекста
interface intrfStoreTS {
  store: StoreTS;
}
// объ.экземпл.кл.
const store = new StoreTS();
// созд.Context для использ.store в комп.ч/з useContext
// export const Context = createContext({ store }); // для JS
export const ContextNRJWT = createContext<intrfStoreTS>({
  store,
}); // для TS

// ^ UlbiTV.PERNstore
export const ContextUTVst = createContext({});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // ^ ДО слияния tokmakov|UlbiTV. СТАРЫЙ ПОДХОД
  // <React.StrictMode>
  //   <Context.Provider value={{ store }}>
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>
  //   </Context.Provider>
  // </React.StrictMode>
  // ^ слияние tokmakov|UlbiTV. НОВЫЙ ПОДХОД
  <React.StrictMode>
    {/* // ^ tokmakov */}
    <AppContextProvider>
      <AppTok />
    </AppContextProvider>
    <hr className="hr" />
    {/* // ^ СТАРЫЙ ПОДХОД */}
    <ContextNRJWT.Provider value={{ store }}>
      <AppStar />
    </ContextNRJWT.Provider>
    {/* // ! прописать отд. NavBar и AppRouter для AppUTV */}
    {/* // ^ UlbiTV.PERNstore */}
    {/* <hr className="hr" />
    <ContextUTVst.Provider value={{ store }}>
      <AppUTV />
    </ContextUTVst.Provider> */}
  </React.StrictMode>
);
