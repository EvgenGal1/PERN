import { observer } from "mobx-react-lite";
import { FormEvent, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  SHOP_ROUTE,
  USER_ROUTE,
} from "@/utils/consts";
import { AppContext } from "@/context/AppContext";
import { useAuthForm } from "@/scripts/hooks/useAuthForm";
import { ApiError } from "@/utils/errorAPI";

// оборач.комп. в observer`наблюдатель` из mobx и отслеж.использ.знач.для renderа
const Auth = observer(() => {
  const { user, basket } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;

  const {
    credentials,
    errors,
    isSubmitting,
    setErrors,
    setIsSubmitting,
    handleChange,
    validateForm,
    resetForm,
  } = useAuthForm(
    { username: "", email: "", password: "", confirmPassword: "" },
    isLogin
  );

  // е/и пользователь авторизован/есть роли/загр.завершена - перенаправление по Роли
  useEffect(() => {
    if (user.isAuth && user.roles.length > 0 && !user.isLoading) {
      const targetRoute = user.isAdmin ? ADMIN_ROUTE : USER_ROUTE;
      navigate(targetRoute, {
        replace: true, // замена текущ.записи в истор.брауз. (нет кнп.Назад)
        state: { from: location.state?.from || SHOP_ROUTE }, // сохр.путь прихода (возврат на маршрут после Auth)
      });
    }
  }, [user.isAuth, user.roles, location.state]);

  // обраб.данн.формы (запрос/ошб.с БД)
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, sms: "" }));

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (isLogin) {
        await user.login({
          email: credentials.email,
          password: credentials.password,
        });
        // раздел.загр.Корзины чтоб взять id из user
        await basket.loadBasket();
      } else {
        await user.register({
          email: credentials.email,
          password: credentials.password,
          username: credentials.username,
        });
      }
      setErrors({ email: "", password: "", sms: "" });
    } catch (error: unknown) {
      resetForm();
      const apiError = error as ApiError;
      setErrors((prev) => ({
        ...prev,
        sms:
          apiError.message === "Unauthorized"
            ? "Произошла ошибка при Авторизации"
            : apiError.message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // разрешение на отправку формы е/и всё заполнено и нет ошибок
  const isFormValid: string | boolean = isLogin
    ? credentials.email &&
      credentials.password &&
      !errors.email &&
      !errors.password
    : credentials.email &&
      credentials.password &&
      credentials.username! &&
      credentials.confirmPassword! &&
      !errors.email &&
      !errors.password &&
      !errors.username &&
      !errors.confirmPassword;

  return (
    <div className="auth-container df df-jcc">
      <div
        className="auth-card new__my-chat p-4 card--eg"
        style={{
          width: "75%",
        }}
      >
        <h2 className="auth-title m-auto tac">
          {isLogin ? "Авторизация" : "Регистрация"}
        </h2>
        <form
          className="auth-form form form--eg df df-col p-4"
          onSubmit={handleSubmit}
        >
          {/* Name */}
          {!isLogin && (
            <div className="auth-input df df-col">
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                className={`auth-input inpt--eg ${errors.username ? "err-inpt" : credentials.username ? "err-inpt-suces" : ""}`}
                placeholder="Имя пользователя"
                autoComplete="username"
              />
              {errors.username && (
                <span className="auth-error err mt-2">{errors.username}</span>
              )}
            </div>
          )}
          {/* Email */}
          <div className="auth-input df df-col mt-3">
            {/* <label htmlFor="email">Email:</label> */}
            <input
              // id="email"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              // выделен.кнп. е/и есть errors то cl.err-inpt, е/и есть value то cl.err-inpt-suces
              className={`auth-input inpt--eg ${
                errors.email
                  ? "err-inpt"
                  : credentials.email
                    ? "err-inpt-suces"
                    : ""
              }  
                  `}
              placeholder="введите Ваш email"
              autoComplete="username"
            />
            {errors.email && (
              <span className="auth-error err mt-2">{errors.email}</span>
            )}
          </div>
          {/* Password */}
          <div className="auth-input df df-col mt-3">
            {/* <label htmlFor="password">Пароль:</label> */}
            <input
              // id="password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className={`auth-input inpt--eg ${
                errors.password
                  ? "err-inpt"
                  : credentials.password
                    ? "err-inpt-suces"
                    : ""
              } `}
              placeholder="введите Ваш пароль"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            {errors.password && (
              <span className="auth-error err mt-2">{errors.password}</span>
            )}
          </div>
          {/* Подтверждение Password */}
          {!isLogin && (
            <div className="auth-input df df-col mt-3">
              <input
                type="password"
                name="confirmPassword"
                value={credentials.confirmPassword}
                onChange={handleChange}
                className={`auth-input inpt--eg ${errors.confirmPassword ? "err-inpt" : credentials.confirmPassword ? "err-inpt-suces" : ""}`}
                placeholder="Подтвердите пароль"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <span className="auth-error err mt-2">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          )}
          {errors.sms && !credentials.email && !credentials.password && (
            <span
              className="auth-alert m-auto tac err err-msg mt-3"
              style={{ color: "darkred", textShadow: "1px 1px 0px black" }}
            >
              {errors.sms}
            </span>
          )}
          <div className="df df-col mt-3">
            <button
              type="submit"
              className="auth-button btn--eg btn-success--eg"
              // блок.кнп. е/и пусты email/password или есть ошб.
              disabled={!isFormValid || isSubmitting}
            >
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </button>
            <div className="auth-switch">
              {isLogin ? (
                <p className="tac mt-2 mb-0">
                  Нет аккаунта?{" "}
                  <Link to={REGISTER_ROUTE} className="auth-link">
                    Зарегистрирутесь!
                  </Link>
                </p>
              ) : (
                <p className="tac mt-2 mb-0">
                  Уже есть аккаунт?{" "}
                  <Link to={LOGIN_ROUTE} className="auth-link">
                    Войдите!
                  </Link>
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

export default Auth;
