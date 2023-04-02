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
      console.log("LF log ", log);
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

  // РЕГИСТРАЦИЯ
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

  // будущая общ. fn для loginRegistr
  async function loginRegistr(/* e: React.FormEvent<HTMLFormElement> */) {
    // e.preventDefault();
    console.log("e ", 123);
  }

  return (
    // {/* <h1>
    //   {store.isAuth
    //     ? `Пользователь авторизован ${store.user.username} <${store.user.email}>`
    //     : "АВТОРИЗУЙТЕСЬ"}
    // </h1> */}
    <form /* onSubmit={(e) => loginRegistr()} */>
      {/* управ.inputы */}
      <input
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        type="username"
        placeholder="Имя"
      />
      {/* попытка обраб.ошб. Выводит, но нет распределения по inputам */}
      {/* {store.isErr && (
        <p className="error-msg">{store.isErr || "Error! В lastName"}</p>
      )} */}
      {/* store.isErr */}
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
      <div className="management">
        <button
          name="login"
          onClick={(e) => {
            e.preventDefault();
            login();
          }}
          // onClick={() => login() /* store.login(username, email, password) */}
        >
          Логин
        </button>
        <button
          name="registr"
          // className="btn--primary"
          onClick={(e) => {
            e.preventDefault();
            registr();
          }}
          // onClick={() => registr() /* store.registration(username, email, password) */}
        >
          Регистрации
        </button>
      </div>
      {/* // ^ сделать появл.доп.input, при опред.комбин.клвш., у ADMIN|MODER|SUPER для ввода доп.полей(role,img,возвраст,..)  */}
      {/*  */}
      {/* // ^ Лучше использовать react-hook-form */}
      {/* {err && <div className="err">{store.isErr}</div>} */}
      {store.isErr && (
        <p className="error-msg">{store.isErr || "Error! В lastName"}</p>
      )}
    </form>
  );
};

export default observer(LoginForm);
