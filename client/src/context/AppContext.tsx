// ^ Контекст. По умолч.и передаваемый

import { createContext, FC, ReactNode } from "react";

import UserStore from "@/store/UserStore";
import CatalogStore from "@/store/CatalogStore";
import BasketStore from "@/store/BasketStore";
import OrderStore from "@/store/OrderStore";

// интерф.> тип.хранилищ
type AppContextValue = {
  user: UserStore;
  catalog: CatalogStore;
  basket: BasketStore;
  order: OrderStore;
};

// инициализация экземпляров хранилищ по отделельности один раз при загрузке модуля
const userStore = new UserStore();
const catalogStore = new CatalogStore();
const basketStore = new BasketStore();
const orderStore = new OrderStore();

// контекст приложения с нач.знач. > передачи
const AppContext = createContext<AppContextValue>({
  user: userStore,
  catalog: catalogStore,
  basket: basketStore,
  order: orderStore,
});

// провайдер контекста с передачей значен.контексту/дочер.эл.
const AppContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AppContext.Provider
      value={{
        user: userStore,
        catalog: catalogStore,
        basket: basketStore,
        order: orderStore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
