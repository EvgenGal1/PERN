import React, { FC, useContext, useEffect } from "react";
import "./App.css";
import LoginForm from "./client/src/components/LoginForm";
import { Context } from "../index";
// обёрка прилож.для отслеж.измен.в данн.
import { observer } from "mobx-react-lite";
const App: FC = () => {
  // извлек.store ч/з usConst
  const { store } = useContext(Context);

  // вызов экшн checkAuth, е/и есть в LS, при 1ом запуске(usEf пуст масс.завис.)
  useEffect(() => {
    console.log(1);
    if (localStorage.getItem("tokenAccess")) {
      store.checkAuth();
    }
  }, []);
  console.log("Ap localStorage ", localStorage.getItem("tokenAccess"));
  let red = "red";

  return (
    <div className="App">
      <h1>
        {/* {red */}
        {store.isAuth
          ? // ? `Пользователь авторизован `
            `Пользователь авторизован ${store.user.username} <${store.user.email}>`
          : "АВТОРИЗУЙТЕСЬ"}
      </h1>
      <LoginForm />
    </div>
  );
};

// export default App;
// обёрка прилож.в observer отслеж.измен.в данн.
export default observer(App);
