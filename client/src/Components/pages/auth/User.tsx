import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

import { AppContext } from "../../layout/AppTok/AppContext";
import { logout } from "../../../http/Tok/userAPI_Tok";

const User = () => {
  const { user }: any = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = (event: any) => {
    logout();
    user.logout();
    navigate("/login", { replace: true });
  };

  return (
    <Container>
      <h1>Личный кабинет</h1>
      <p>Это личный кабинет постоянного покупателя магазина</p>
      <Button onClick={handleLogout}>Выйти</Button>
    </Container>
  );
};

export default User;
