import React, { FC, useState, useContext } from "react";
import { Context } from "../../../../index";

const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>("");
  // const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { store } = useContext(Context);
  return (
    <div>
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
      {/* <input
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        type="username"
        placeholder="Имя"
      /> */}

      <button onClick={() => store.login(email, /* username, */ password)}>
        Логин
      </button>
      <button
        onClick={() => store.registration(email, /* username, */ password)}
      >
        Регистрации
      </button>
    </div>
  );
};

export default LoginForm;
