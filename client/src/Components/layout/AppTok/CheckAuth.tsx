// ^ HOC-компонент (Компонент высшего порядка). Повторн использ.логики. Fn приним.Комп и возвращ.нов.Комп.
// ^ авториз.польз.при наличии в хран.правильного токена.
import React, { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

import { AppContext } from "./AppContext";
import { checkUser } from "../../../http/Tok/userAPI_Tok";

const CheckAuth = (props: any) => {
  const { user }: any = useContext(AppContext);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkUser()
      .then((data: any) => {
        if (data) {
          user.login(data);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return <Spinner animation="border" variant="light" />;
  }

  return props.children;
};

export default CheckAuth;
