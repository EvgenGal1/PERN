import React, {
  useState,
  useContext,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { loginUser, signupUser } from "../../../../http/Tok/userAPI_Tok";
import {
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  USER_ROUTE,
  ADMIN_ROUTE,
} from "../../../../utils/consts";

interface FormValues {
  sms: "";
  // name: string;
  email: string;
  password: string;
  // confirmPassword: string;
}

interface FormErrors {
  sms?: "";
  // name: string;
  email?: string;
  password?: string;
  // confirmPassword?: string;
}

// оборач.комп. в observer`наблюдатель` из mobx и отслеж.использ.знач.для renderа
const Auth = observer(() => {
  const { user }: any = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;

  // state Formы. values/errors
  const [formValues, setFormValues] = useState<FormValues>({
    sms: "",
    // name: "",
    email: "",
    password: "",
    // confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    sms: "",
    // name: "",
    email: "",
    password: "",
    // confirmPassword: "",
  });
  // проверка валидности всей формы (е/и нет ошибок)
  const isFormValid = Object.values(formErrors).every((error) => error === "");

  // если пользователь авторизован, перенаправление по Роли
  useEffect(() => {
    if (user.isAuth) navigate(USER_ROUTE, { replace: true });
    if (user.isAdmin) navigate(ADMIN_ROUTE, { replace: true });
  }, [navigate, user.isAdmin, user.isAuth]);

  // проверка Formы
  const validateForm = (name: string, value: string): /* void | */ boolean => {
    const errors: FormErrors = { ...formErrors };

    // Проверка имени
    // if (!formValues.name.trim()) { errors.name = "Поле обязательно для заполнения"; }
    // else if (formValues.name.trim().length < 3) { errors.name = "Имя должно содержать не менее 3 символов"; }
    // else { errors.name = "";}

    // Проверка email
    if (name === "email") {
      // Проверка наличия имени перед символом @
      let [emailName, emailDomain] = "";
      if (value.includes("@")) {
        [emailName, emailDomain] = value.split("@");
      }
      // Проверка наличия доменного имени почтового сервиса (mail|yandex|google)
      let emailService, topLevelDomain;
      // Проверка наличия домена первого уровня (ru|com|org|net)
      if (value.includes(".")) {
        emailService = emailDomain.split(".").shift();
        topLevelDomain = emailDomain.split(".").pop();
      }
      if (!(/*formValues.email*/ value.trim())) {
        errors.email = "Поле обязательно для заполнения";
      } else if (!value.includes("@")) {
        errors.email = "Отсутствует символ @";
      } else if (emailName.length === 0) {
        errors.email = "Отсутствует Имя перед символом @";
      } else if (!emailService) {
        errors.email =
          "Отсутствует доменное имя почтового сервиса после @ и перед . (mail|yandex|google)";
      } else if (/[0-9]/.test(emailService)) {
        errors.email = `Домен почтового сервиса не должен содержать цифр - ${emailService}`;
      } else if (!/[a-z]{2,8}/.test(emailService)) {
        errors.email = `Домен почтового сервиса слишком короткий - ${emailService}`;
      } else if (emailService.length > 8) {
        errors.email = `Домен почтового сервиса слишком длинный - ${emailService}`;
      } else if (!value.includes(".")) {
        errors.email = "Нет разделителя почт.серв. и домена в виде точки(.)";
      } else if (!topLevelDomain) {
        errors.email = "Нет домена первого уровня (ru|com|org|net)";
      } else if (/[0-9]/.test(topLevelDomain)) {
        errors.email = `Домен первого уровня не должен содержать цифр - ${topLevelDomain}`;
      } else if (!/[a-z]{2,4}/.test(topLevelDomain)) {
        errors.email = `Домен первого уровня слишком короткий - ${topLevelDomain}`;
      } else if (topLevelDomain.length > 4) {
        errors.email = `Домен первого уровня слишком длинный - ${topLevelDomain}`;
      } else if (/[а-яА-Я]/.test(value)) {
        errors.email = `Email должен содержать буквы литиницы - ${value}`;
      } else if (/(?=.*\s)/.test(value)) {
        errors.email = `Email не должен содержать пробелов - ${value}`;
      } else if (!/^[\w-.@]+@[a-z]{2,8}\.[a-z]{2,4}$/i.test(value)) {
        errors.email = `Email не соответствует формату имя@сервис.домен - ${value}`; // Например - test@mail.ru
      } else {
        errors.email = "";
      }
    }

    // Проверка пароля
    if (name === "password") {
      if (!(/* formValues.password */ value.trim())) {
        errors.password = "Поле обязательно для заполнения";
      } else if (/[а-яА-Я]/.test(value)) {
        errors.password = `Пароль должен содержать буквы литиницы - ${value}`;
      } else if (!/[a-z]/.test(value)) {
        errors.password = `Пароль должен содержать хотя бы одну строчную букву - ${value}`;
      } else if (!/[A-Z]/.test(value)) {
        errors.password = `Пароль должен содержать хотя бы одну заглавную букву - ${value}`;
      } else if (!/(?=.*\d)/.test(value)) {
        errors.password = `Пароль должен содержать хотя бы одну цифру - ${value}`;
      } else if (!/(?=(.*\W){2})/.test(value)) {
        errors.password = `Пароль должен содержать как минимум 2 специальных символа - ${value}`;
      } else if (/(?=.*\s)/.test(value)) {
        errors.password = `Пароль не должен содержать пробелов - ${value}`;
      } else if (value.trim().length < 6) {
        errors.password = "Пароль должен содержать не менее 6 символов";
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=(.*\W){2})[a-zA-Z\d\W]{6,}$/.test(
          value
        )
      ) {
        errors.password =
          "Пароль должен содержать минимум одну цифру/заглавную/строчную букву, два спец.символа";
      } else {
        errors.password = "";
      }
    }

    // Проверка подтверждения пароля
    // if (!formValues.confirmPassword.trim()) { errors.confirmPassword = "Поле обязательно для заполнения"; }
    // else if (formValues.confirmPassword.trim() !== value.trim()) { errors.confirmPassword = "Пароли не совпадают"; }
    // else { errors.confirmPassword = ""; }

    // сброс sms
    errors.sms = "";

    // ^ проверка разности email и password (не должны совпадать или быть похожими)
    // ^ проверка уникальности. не должно быть простых комбинаций, последовательных знаков/букв

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // отслеживание/валидация ввода
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    validateForm(name, value);
    setFormValues(
      (prevValues: FormValues): FormValues => ({
        ...prevValues,
        [name]: value,
      })
    );
  };

  // обработка данных (запрос к БД/маршрут в ЛК/ошибки с БД)
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) /* : void */ => {
    event.preventDefault();

    // ч/з опред.метод запрос к БД
    let dataRes: any; //{ errors: any[]; message: any; };
    if (isLogin)
      dataRes = await loginUser(formValues.email, formValues.password);
    else dataRes = await signupUser(formValues.email, formValues.password);
    // console.log("DATA 00000 ", dataRes);

    // пров./ввывод errors
    if (dataRes?.data?.errors) {
      dataRes.data.errors.forEach((error: any) => {
        if (error.param === "email") {
          setFormErrors((prevState) => ({
            ...prevState,
            email: prevState.email
              ? prevState.email + "\n" + error.msg + " - " + error.value
              : error.msg + " - " + error.value,
          }));
        } else if (error.param === "password") {
          setFormErrors((prevState) => ({
            ...prevState,
            password: prevState.password
              ? prevState.password + `\n` + error.msg + " - " + error.value
              : error.msg + " - " + error.value,
          }));
        }
      });

      if (dataRes?.data?.message) {
        setFormErrors((prevState) => ({
          ...prevState,
          sms: dataRes.data.message,
        }));
      }
    }

    // перенаправление в ЛК е/и нет ошб., прошёл Польз.
    if (!dataRes?.data?.errors && dataRes.email && dataRes.role) {
      setFormErrors({ sms: "", email: "", password: "" });
      user.login(dataRes);
      if (user.isAdmin) navigate(ADMIN_ROUTE);
      if (user.isAuth) navigate(USER_ROUTE);
    }
  };

  return (
    <div className="container df df-jcc">
      <div
        className="new__my-chat p-2 card--eg"
        style={{
          width: "50%",
        }}
      >
        <h3 className="m-auto txt">
          {isLogin ? "Авторизация" : "Регистрация"}
        </h3>
        {formErrors.sms && (
          <span className="m-auto txt err err-msg">{formErrors.sms}</span>
        )}
        <form className="form df df-col" onSubmit={handleSubmit}>
          <div>
            {/* Name */}
            {/* <div>
              <label htmlFor="name">Имя:</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChangeMyChat}
              />
              {formErrors.name && <span>{formErrors.name}</span>}
            </div> */}
            {/* Email */}
            <div className="df df-col mt-3">
              {/* <label htmlFor="email">Email:</label> */}
              <input
                // id="email"
                type="email"
                name="email"
                value={formValues.email}
                onChange={(e) => handleChange(e)}
                // е/и есть value и errors то cl.err-inpt, е/и есть value и нет errors то cl.err-inpt-suces
                className={`inpt--eg ${
                  formValues.email !== "" && formErrors.email
                    ? "err-inpt"
                    : formValues.email !== "" && !formErrors.email
                    ? "err-inpt-suces"
                    : ""
                }  
                  `}
                placeholder="Введите ваш email..."
              />
              {formErrors.email && (
                <span className="err">{formErrors.email}</span>
              )}
            </div>
            {/* Password */}
            <div className="df df-col mt-3">
              {/* <label htmlFor="password">Пароль:</label> */}
              <input
                // id="password"
                type="password"
                name="password"
                value={formValues.password}
                onChange={(e) => handleChange(e)}
                className={`inpt--eg ${
                  formValues.password !== "" && formErrors.password
                    ? "err-inpt"
                    : formValues.password !== "" && !formErrors.password
                    ? "err-inpt-suces"
                    : ""
                } `}
                placeholder="Введите ваш пароль..."
              />
              {formErrors.password && (
                <span className="err">{formErrors.password}</span>
              )}
            </div>
            {/* Подтверждение Password */}
            {/* <div>
              // <label htmlFor="confirmPassword">Подтверждение пароля:</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChangeMyChat}
                // isValid={validEmail === true}
                // isInvalid={validEmail === false}
                className="mt-3"
                placeholder="Введите ваш email..."
              />
              {formErrors.confirmPassword && (
                <span>{formErrors.confirmPassword}</span>
              )}
            </div> */}
          </div>
          <div className="df df-col mt-3">
            <button
              type="submit"
              className="btn--eg btn-success--eg"
              // блок.кнп. е/и пусты email/password или есть ошб.
              disabled={
                formValues.email === "" ||
                formValues.password === "" ||
                !isFormValid
              }
            >
              {isLogin ? "Войти" : "Регистрация"}
            </button>
            {isLogin ? (
              <p className="txt mt-2 mb-0">
                Нет аккаунта? <Link to={SIGNUP_ROUTE}>Зарегистрирутесь!</Link>
              </p>
            ) : (
              <p className="txt mt-2 mb-0">
                Уже есть аккаунт? <Link to={LOGIN_ROUTE}>Войдите!</Link>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
});

export default Auth;
