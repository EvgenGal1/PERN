import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Card, Form, Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { signupUser } from "../../../../http/Tok/userAPI_Tok";
import {
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  USER_ROUTE,
  ADMIN_ROUTE,
} from "../../../../utils/consts";

// оборач.комп. в observer`наблюдатель` из mobx и отслеж.использ.знач. для renderа
const Signup = observer(() => {
  const { user }: any = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;

  // если пользователь авторизован — ему здесь делать нечего
  useEffect(() => {
    if (user.isAuth) navigate(USER_ROUTE, { replace: true });
    if (user.isAdmin) navigate(ADMIN_ROUTE, { replace: true });
  }, [navigate, user.isAdmin, user.isAuth]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();
    const data = await signupUser(email, password);
    if (data) {
      user.login(data);
      if (user.isAdmin) navigate(ADMIN_ROUTE);
      if (user.isAuth) navigate(USER_ROUTE);
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card
        style={{ width: "50%" /* // ! , :hover: { cursor: "pointer"} */ }}
        className="p-2"
      >
        {/* mt-5 bg-light */}
        <h3 className="m-auto">{isLogin ? "Авторизация" : "Регистрация"}</h3>
        <Form className="d-flex flex-column" onSubmit={handleSubmit}>
          <Form.Control
            name="email"
            className="mt-3"
            placeholder="Введите ваш email..."
          />
          <Form.Control
            name="password"
            className="mt-3"
            placeholder="Введите ваш пароль..."
          />
          <Row className="d-flex justify-content-between mt-3 pl-3 pr-3 m-0">
            <Button variant={"outline-success"} type="submit">
              {isLogin ? "Войти" : "Регистрация"}
            </Button>
            {isLogin ? (
              <p className="text-center mt-2 mb-0">
                Нет аккаунта? <Link to={SIGNUP_ROUTE}>Зарегистрирутесь!</Link>
              </p>
            ) : (
              <p className="text-center mt-2 mb-0">
                Уже есть аккаунт? <Link to={LOGIN_ROUTE}>Войдите!</Link>
              </p>
            )}
          </Row>
        </Form>
      </Card>
    </Container>
  );
});

export default Signup;
