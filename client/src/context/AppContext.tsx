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

// контекст, который будем передавать
const context: AppContextValue = {
  user: new UserStore(),
  catalog: new CatalogStore(),
  basket: new BasketStore(),
};

const AppContext = createContext<AppContextValue>(context);

const AppContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };
