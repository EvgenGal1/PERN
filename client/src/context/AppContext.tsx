// ^ Контекст. По умолч.и передаваемый

import { createContext, FC, ReactNode } from "react";

import UserStore from "@/store/UserStore";
import CatalogStore from "@/store/CatalogStore";
import BasketStore from "@/store/BasketStore";

// интерф.> тип.хранилищ
interface AppContextValue {
  user: UserStore;
  catalog: CatalogStore;
  basket: BasketStore;
}

// инициализация экземпляров хранилищ по отделельности один раз при загрузке модуля
const userStore = new UserStore();
const catalogStore = new CatalogStore();
const basketStore = new BasketStore();

// контекст приложения с нач.знач. > передачи
const AppContext = createContext<AppContextValue>({
  user: userStore,
  catalog: catalogStore,
  basket: basketStore,
});

// провайдер контекста с передачей значен.контексту/дочер.эл.
const AppContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AppContext.Provider
      value={{ user: userStore, catalog: catalogStore, basket: basketStore }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
