import React, { FC, useState, useContext } from "react";
import { ContextNRJWT } from "../../../../index";
// обёрка прилож.для отслеж.измен.в данн.
import { observer } from "mobx-react-lite";

// import{};
export {};

const UserAutoriz: FC = (storeAyth) => {
  // локалн.сост eml,unam,psw с тип.,пуст.стр.
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // извлек.store ч/з usConst
  const { store } = useContext(ContextNRJWT);
  return (
    // {/* <h1>
    //   {store.isAuth
    //     ? `Пользователь авторизован ${store.user.username} <${store.user.email}>`
    //     : "АВТОРИЗУЙТЕСЬ"}
    // </h1> */}
    <div className="form auth-form">
      <h1>
        {store.isAuth
          ? `Пользователь авторизован ${store.user.username} <${store.user.email}>`
          : "АВТОРИЗУЙТЕСЬ"}
      </h1>
      {/* актв.акаунт. */}
      <h2>
        {store.user.isActivated
          ? "Аккаунт подтверждён по почте"
          : "ПОДТВЕРДИТЕ АККАУНТ в ПОЧТЕ"}
      </h2>
      {/* кнп.выйти */}
      <button className="" onClick={() => store.logout()}>
        Выйти
      </button>
    </div>
  );
};

export default observer(UserAutoriz);
