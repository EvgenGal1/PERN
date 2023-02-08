import React, { FC, useContext, useEffect, useState } from "react";
import "./App.css";
import LoginForm from "./client/src/components/LoginForm";
import { Context } from "../index";
// обёрка прилож.для отслеж.измен.в данн.
import { observer } from "mobx-react-lite";
import { IUser } from "../models/IUser";
import UserService from "../service/user.service";

const App: FC = () => {
  // извлек.store ч/з usConst
  const { store } = useContext(Context);
  // лог.сост для польз. Тип масс.польз.Пуст.масс.
  const [users, setUsers] = useState<IUser[]>([]);

  // вызов экшн checkAuth, е/и есть в LS, при 1ом запуске(usEf пуст масс.завис.)
  useEffect(() => {
    console.log(1);
    if (localStorage.getItem("tokenAccess")) {
      store.checkAuth();
    }
  }, []);
  console.log("Ap localStorage ", localStorage.getItem("tokenAccess"));

  // fn получ.польз.
  async function getUsers() {
    const response = await UserService.fetchUser();
    // возращ.с serv помещ.в сост.
    setUsers(response.data);
    try {
    } catch (error) {
      console.log("CLT.Ap.gUs error ", error);
    }
  }

  // при перезагрузке от мелькания текста перед формой
  if (store.isLoading) {
    return <div>Загрузка...</div>;
  }

  // е/и не авториз.
  if (!store.isAuth) {
    return (
      <>
        <LoginForm />
        <div>
          <button onClick={getUsers}>Получить пользователей</button>
          {users.map((user) => (
            <div key={user.email}>
              {user.username} &lt;{user.email}&gt;
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="App">
      {/* е/и авториз. */}
      <h1>
        {store.isAuth
          ? `Пользователь авторизован ${store.user.username} <${store.user.email}>`
          : "АВТОРИЗУЙТЕСЬ"}
      </h1>
      {/* актв.акаунт. */}
      <h2>
        {store.user.isActivated
          ? "Аккаунт подтверждён по почте"
          : "ПОДТВЕРДИТЕ АККАУНТ"}
      </h2>
      {/* кнп.выйти */}
      <button onClick={() => store.logout()}>Выйти</button>
      {/* получ.список польз */}
      <div>
        <button onClick={getUsers}>Получить пользователей</button>
        {users.map((user) => (
          <div key={user.email}>
            {user.username} &lt;{user.email}&gt;
          </div>
        ))}
      </div>
    </div>
  );
};

// export default App;
// обёрка прилож.в observer отслеж.измен.в данн.
export default observer(App);
