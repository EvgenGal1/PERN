import React, { FC, useState, useContext } from "react";
import { ContextNRJWT } from "../../../../index";
// обёрка прилож.для отслеж.измен.в данн.
import { observer } from "mobx-react-lite";
import { IUser } from "../../../../models/IUser";
import UserService from "../../../../service/user.service";
// import{};
export {};

const UserList: FC = (/* setShow */) => {
  // локалн.сост eml,unam,psw с тип.,пуст.стр.
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // извлек.store ч/з usConst
  const { store } = useContext(ContextNRJWT);
  // лог.сост для польз. Тип масс.польз.Пуст.масс.
  const [users, setUsers] = useState<IUser[]>([]);
  // сост.error
  const [err, setErr] = useState(null);
  // сост.отраж.списка
  const [show, setShow] = useState(false);

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
  return (
    <div className="boards">
      <button
        onClick={() => {
          setShow(!show);
          getUsers();
        }}
      >
        {show ? "Убрать список" : "Получить пользователей"}
      </button>
      {/* список польз. */}
      {show && ( // show ? users.map : errors
        <div className="board">
          <div className="items">
            {users.map((user) => (
              <div key={user.email} className="item">
                {user.username} &lt;{user.email}&gt;
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ошб.отв. */}
      {err && <div className="err">{err}</div>}
    </div>
  );
};

export default observer(UserList);
