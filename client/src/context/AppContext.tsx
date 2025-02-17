// ^ Контекст. По умолч.и передаваемый
import { createContext, FC, ReactNode } from "react";

import UserStore from "../store/UserStore";
import CatalogStore from "../store/CatalogStore";
import BasketStore from "../store/BasketStore";

// Типы ------------------------------------------------------------------------
export type MyContextTypeUser = {
  user: /* {
    email: string;
    isAuth: boolean;
    isAdmin: boolean;
  }; */ any;
};
export type MyContextTypeProduct = {
  products: [
    {
      id: number;
      name: string;
      price: number;
      rating: number;
      image: string;
      categoryId: number;
      brandId: number;
    },
  ];
};
export type MyContextTypeCategories = {
  categories: [
    {
      id: number;
      name: string;
    },
  ];
};
export type MyContextTypeBrands = {
  brands: [
    {
      id: number;
      name: string;
    },
  ];
};
export type MyContextTypeBasket = {
  basket: [
    {
      product_id: number;
      name: string;
      price: number;
      quantity: number;
    },
  ];
};

type ContextType = {
  user: any;
  catalog: any;
  basket: any;
};

// контекст, который будем передавать
const context: ContextType = {
  user: new UserStore(),
  catalog: new CatalogStore(),
  basket: new BasketStore(),
};

const AppContext = createContext<ContextType>(context);

const AppContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };
