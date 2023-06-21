// ^ Контекст. По умолч.и передаваемый
import React from "react";

import UserStore from "../../../store/Tok/UserStore";
import CatalogStore from "../../../store/Tok/CatalogStore";
import BasketStore from "../../../store/Tok/BasketStore";

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
    }
  ];
};
export type MyContextTypeCategories = {
  categories: [
    {
      id: number;
      name: string;
    }
  ];
};
export type MyContextTypeBrands = {
  brands: [
    {
      id: number;
      name: string;
    }
  ];
};
export type MyContextTypeBasket = {
  basket: [
    {
      product_id: number;
      name: string;
      price: number;
      quantity: number;
    }
  ];
};

// ! ошб. ------------------------------------------------------------------------
// ! ошб. - Ожидалось аргументов: 1, получено: 0.ts(2554); index.d.ts(387, 9): Не указан аргумент для "defaultValue".
// const AppContext = React.createContext({} as any); //
// const AppContext = React.createContext(defaultValue); // ! Не удается найти имя "defaultValue"
// const AppContext = React.createContext();
// const AppContext = React.createContext(
/* {} as
    | MyContextTypeUser
    | MyContextTypeProduct
    | MyContextTypeCategories
    | MyContextTypeBrands
    | MyContextTypeBasket */
// );

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

const AppContext = React.createContext<ContextType>(context);

const AppContextProvider = (props: any) => {
  return (
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
