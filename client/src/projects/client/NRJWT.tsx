import React, { FC, useContext, useEffect, useState } from "react";
import "./NRJWT.scss";

import ArrowAccordionFnComp from "../../Components/ui/accordion/ArrowAccordion.jsx";

import { ContextNRJWT } from "../../index";
// обёрка прилож.для отслеж.измен.в данн.
import { observer } from "mobx-react-lite";
import { IUser } from "../../models/IUser";
import UserService from "../../service/user.service";
// подкл.Комп.
import LoginForm from "./src/components/LoginForm";
import UserAutoriz from "./src/components/UserAutoriz";
import UserList from "./src/components/UsersList";

const NRJWT: FC = () => {
  const [openArrowAccord, setOpenArrowAccord] = useState(false);
  const handleClickRef = () => {
    setOpenArrowAccord(!openArrowAccord);
  };

  // извлек.store ч/з usConst
  const { store } = useContext(ContextNRJWT);
  // лог.сост для польз. Тип масс.польз.Пуст.масс.
  const [users, setUsers] = useState<IUser[]>([]);
  // сост.отраж.списка
  const [show, setShow] = useState(false);
  // сост.error
  const [err, setErr] = useState(null);
  // показ.блок для НЕ/авториз.
  const [shwIsAuth, setShwIsAuth] = useState(false);

  // вызов экшн checkAuth, е/и есть в LS, при 1ом запуске(usEf пуст масс.завис.)
  useEffect(() => {
    if (localStorage.getItem("tokenAccess")) {
      store.checkAuth();
    }
  }, []);

  // при перезагрузке от мелькания текста перед формой
  if (store.isLoading) {
    return <div style={{ background: "red" }}>Загрузка...</div>;
  }

  // е/и не авториз.<LoginForm />
  if (!store.isAuth) {
    // setShwIsAuth(false);
    console.log("shwIsAuth ", shwIsAuth);
    // return (
    // <LoginForm />
    // {/* // откл. всё равно нет доступа у не авториз.
    // <div><button onClick={getUsers}>Получить пользователей</button>{users.map((user)=> (<div key={user.email}>{user.username} &lt;{user.email}&gt;</div>))}</div> */}
    // );
  }

  return (
    <div className="UlbiTV NRJWT accordion">
      <div className="NRJWT__descript">
        <h1
          className={openArrowAccord ? "_active" : ""}
          onClick={() => {
            handleClickRef();
          }}
        >
          NRJWT
        </h1>
        <div className={openArrowAccord ? "openDop" : ""}>
          <div>Проект на основе NRJWT</div>
          <p>https://www.youtube.com/watch?v=fN25fMQZ2v0</p>
          {/* // !!! не раб - эл. наплывают др на друга. Причины пока не понятны */}
          {/* <p style={{ color: "red", backgroundColor: "#111" }}>
            !!! не раб - ошб.
          </p> */}
        </div>
        <ArrowAccordionFnComp
          openArrowAccord={openArrowAccord}
          setOpenArrowAccord={setOpenArrowAccord}
        />
      </div>
      <div
        className="NRJWT__content-- openCont"
        // className={`NRJWT__content--${
        //   openArrowAccord ? " openCont" : ""
        // }`}
      >
        {!store.isAuth /* shwIsAuth */ ? (
          // е/и не авториз.
          <LoginForm />
        ) : (
          // е/и авториз.
          <>
            <UserAutoriz /* store={store} */ /* storeAyth={store.isAuth} */ />
            {/* получ.список польз */}
            <UserList /* setShow={show} */ />
          </>
        )}
      </div>
    </div>
  );
};

// export default NRJWT;
// обёрка прилож.в observer отслеж.измен.в данн. ?в state
export default observer(NRJWT);
