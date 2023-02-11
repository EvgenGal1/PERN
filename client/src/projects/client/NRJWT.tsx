import React, { FC, useContext, useEffect, useState } from "react";
import "./NRJWT.scss";

import LoginForm from "./src/components/LoginForm";
import { Context } from "../../index";
// обёрка прилож.для отслеж.измен.в данн.
import { observer } from "mobx-react-lite";
import { IUser } from "../../models/IUser";
import UserService from "../../service/user.service";

const NRJWT: FC = () => {
  // извлек.store ч/з usConst
  const { store } = useContext(Context);
  // лог.сост для польз. Тип масс.польз.Пуст.масс.
  const [users, setUsers] = useState<IUser[]>([]);
  // сост.отраж.списка
  const [show, setShow] = useState(false);
  // сост.error
  const [err, setErr] = useState(null);

  // вызов экшн checkAuth, е/и есть в LS, при 1ом запуске(usEf пуст масс.завис.)
  useEffect(() => {
    if (localStorage.getItem("tokenAccess")) {
      store.checkAuth();
    }
  }, []);

  // fn получ.польз.
  async function getUsers() {
    setErr(null);
    try {
      const response = await UserService.fetchUser();
      // возращ.с serv помещ.в сост.
      setUsers(response.data);
    } catch (error: any) {
      setErr(error?.response?.data?.message);
      console.log(error);
      console.log(error?.response?.data);
    }
  }

  // при перезагрузке от мелькания текста перед формой
  if (store.isLoading) {
    return <div style={{ background: "red" }}>Загрузка...</div>;
  }

  // е/и не авториз.
  if (!store.isAuth) {
    return (
      <LoginForm />
      // {/* // откл. всё равно нет доступа у не авториз.
      // <div><button onClick={getUsers}>Получить пользователей</button>{users.map((user)=> (<div key={user.email}>{user.username} &lt;{user.email}&gt;</div>))}</div> */}
    );
  }

  return (
    <div className="NRJWT">
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
          : "ПОДТВЕРДИТЕ АККАУНТ в ПОЧТЕ"}
      </h2>
      {/* кнп.выйти */}
      <button onClick={() => store.logout()}>Выйти</button>
      {/* получ.список польз */}
      <div>
        <button
          onClick={() => {
            setShow(!show);
            getUsers();
          }}
        >
          {show ? "Убрать список" : "Получить пользователей"}
        </button>
        {show && // show ? users.map : errors
          users.map((user) => (
            <div key={user.email}>
              {user.username} &lt;{user.email}&gt;
            </div>
          ))}
        {show && <div>{err}</div>}
      </div>
    </div>
  );
};

// export default NRJWT;
// обёрка прилож.в observer отслеж.измен.в данн. ?в state
export default observer(NRJWT);
