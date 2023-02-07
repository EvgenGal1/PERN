import React, { FC, useState, useContext } from "react";
import { Context } from "../../../../index";
// обёрка прилож.для отслеж.измен.в данн.
import { observer } from "mobx-react-lite";

const LoginForm: FC = () => {
  // локалн.сост eml,unam,psw с тип.,пуст.стр.
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // извлек.store ч/з usConst
  const { store } = useContext(Context);
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
      <button onClick={() => store.login(username, email, password)}>
        Логин
      </button>
      <button onClick={() => store.registration(username, email, password)}>
        Регистрации
      </button>
      {/* // ^ сделать появл.доп.input, при опред.комбин.клвш., у ADMIN|MODER|SUPER для ввода доп.полей(role,img,возвраст,..)  */}
    </div>
  );
};

export default observer(LoginForm);
