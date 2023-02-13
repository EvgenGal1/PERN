import React, { FC, useState, useContext } from "react";
import { Context } from "../../../../index";
// обёрка прилож.для отслеж.измен.в данн.
import { observer } from "mobx-react-lite";

import UserService from "../../../../service/user.service";
import { IUser } from "../../../../models/IUser";
import { AuthResponse } from "../../../../models/response/auth.response";
export {};

const LoginForm: FC = () => {
  // извлек.store ч/з usConst
  const { store } = useContext(Context);
  // локалн.сост eml,unam,psw с тип.,пуст.стр.
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // отв. login
  const [log, setLog] = useState(null);
  // сост.error
  const [err, setErr] = useState<string>(/* <AuthResponse> */ "");
  /* null */
  console.log("err ", err);
  // сост.отраж.списка
  const [show, setShow] = useState(false);

  const [users, setUsers] = useState<IUser[]>([]);

  // fn LOGIN
  async function login() {
    console.log("LF 0 ", 0);
    setErr("");
    try {
      console.log("LF 1 ", 1);
      // const response = await UserService.fetchUser();
      const log = await store.login(username, email, password);
      // setErr
      console.log("log ", log);
      // const response = await UserService.fetchUser();
      // // возращ.с serv помещ.в сост.
      // setLog(log);
      setErr(store.isErr);
      console.log("LF store.isErr ", store.isErr);
      console.log("LF store.isLoading ", store.isLoading);
      // setUsers(response.data);
      return;
    } catch (error: any) {
      console.log("LF 2 ", 2);
      console.log("LF store.isErr ", store.isErr);
      // setErr(error);
      setErr(error?.response?.data.message);
      // setErr(error?.response?.data?.errors?.map((item: any) => item.msg));
      console.log("---------- 1 ", 1);
      console.log(error?.response?.data.message);
      // setErr(error?.response?.data?.message);
      console.log("---------- 2 ", 2);
      console.log(error);
      // console.log(error?.response?.data);
    }
  }

  async function registr() {
    setErr("");
    try {
      const registr = await store.registration(username, email, password);
      setErr(store.isErr);
    } catch (error: any) {
      setErr(error?.response?.data.message);
      console.log(error);
      console.log(error?.response?.data);
    }
  }

  return (
    // {/* <h1>
    //   {store.isAuth
    //     ? `Пользователь авторизован ${store.user.username} <${store.user.email}>`
    //     : "АВТОРИЗУЙТЕСЬ"}
    // </h1> */}
    <div>
      {/* управ.inputы */}
      <input
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        type="username"
        placeholder="Имя"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Пароль"
      />
      {/* btnы по клик вызов экшн из store с перед.парам. */}
      <button
        onClick={() => login() /* store.login(username, email, password) */}
      >
        Логин
      </button>
      <button
        onClick={
          () => registr() /* store.registration(username, email, password) */
        }
      >
        Регистрации
      </button>
      {/* // ^ сделать появл.доп.input, при опред.комбин.клвш., у ADMIN|MODER|SUPER для ввода доп.полей(role,img,возвраст,..)  */}
      {err && <div className="err">{/* err */ store.isErr}</div>}
    </div>
  );
};

export default observer(LoginForm);
