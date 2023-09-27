import { AppContext } from "../../../layout/AppTok/AppContext";
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form } from "react-bootstrap";

const Login = () => {
  const { user }: any = useContext(AppContext);
  const navigate = useNavigate();

  // если пользователь авторизован — ему здесь делать нечего
  // useEffect(() => {
  //   if (user.isAuth) navigate("/user", { replace: true });
  //   if (user.isAdmin) navigate("/admin", { replace: true });
  // }, []);

  return (
    <div className="container d-flex justify-content-center">
      <Card
        style={{ width: "50%" /* // ! , :hover: { cursor: "pointer"} */ }}
        className="p-2 card-form--eg"
      >
        {/* mt-5 bg-light */}
        <h3 className="m-auto">Авторизация</h3>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш email..."
            defaultValue=""
          />
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш пароль..."
            defaultValue=""
          />
          <div className="df df-row df-jcb mt-3 pl-3 pr-3">
            <button type="submit" className="btn--eg">
              Войти
            </button>
            <p className="text-center mt-2 mb-0">
              Нет аккаунта? <Link to="/signup">Зарегистрирутесь!</Link>
            </p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
