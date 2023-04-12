import React from "react";

type MyContextType = {
  user: {
    email: string;
    isAuth: boolean;
    isAdmin: boolean;
  };
};

// const AppContext = React.createContext();
const AppContext = React.createContext({} as MyContextType);
// const AppContext = React.createContext(context);
// const AppContext = React.createContext<IProducts>({} as IProducts);

// контекст, который будем передавать
const context = {
  user: {
    email: "ivanov@mail.ru",
    isAuth: true,
    isAdmin: true,
  },
};

const AppContextProvider = (props: any) => {
  return (
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
