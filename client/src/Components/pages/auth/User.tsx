import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

import { AppContext } from "../../layout/AppTok/AppContext";
import { USERORDER_ROUTE } from "../../../utils/consts";
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
      <ul>
        <li>
          <Link to={USERORDER_ROUTE}>История заказов</Link>
        </li>
      </ul>
      <Button
        onClick={handleLogout}
        variant="primary"
        size="sm"
        className="btn-primary__eg"
      >
        Выйти
      </Button>
    </Container>
  );
};

export default User;
