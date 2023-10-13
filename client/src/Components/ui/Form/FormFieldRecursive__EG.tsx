import React, { ChangeEvent, useState } from "react";

type LeafValue = [string, string];
type NestedValue = [Value, Value][];
type Value = string | LeafValue | NestedValue;

interface Props {
  valueArr: any; // массив значений
  validationArr?: any; // валидация input
  handleChange: any; // обраб.измененийhandle
  handleSubmit?: any; // кнп.обраб. формы
  MsgBtn?: any; // СМС кнп.обраб. форме
  label?: any; // подпись input
  legend?: any; // подпись/вкл. набора полей
  formClass?: any; // класс для формы
  fieldClass?: any; // класс для набора полей
  body?: any; // альтернатива valueObj (Компонент/текст)
  axis?: string; // направление оси расположения эл.(по умолч.вертикально)
}

interface FormErrors {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  comment?: string;
  sms?: "";
  password?: string;
}

// проверка Formы
const validateForm = (
  name: string,
  value: string,
  formErrors: any,
  setFormErrors: any
): /* void | */ boolean => {
  const errors: FormErrors = { ...formErrors };

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
    } else if (/[а-яА-Я]/.test(value)) {
      errors.email = `Email должен содержать буквы литиницы - ${value}`;
    } else if (!/[a-zA-Z]{2,4}/.test(topLevelDomain)) {
      errors.email = `Домен первого уровня слишком короткий - ${topLevelDomain}`;
    } else if (topLevelDomain.length > 4) {
      errors.email = `Домен первого уровня слишком длинный - ${topLevelDomain}`;
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

  // Проверка имени
  // if (!formValues.name.trim()) { errors.name = "Поле обязательно для заполнения"; }
  // else if (formValues.name.trim().length < 3) { errors.name = "Имя должно содержать не менее 3 символов"; }
  // else { errors.name = "";}

  // Проверка подтверждения пароля
  // if (!formValues.confirmPassword.trim()) { errors.confirmPassword = "Поле обязательно для заполнения"; }
  // else if (formValues.confirmPassword.trim() !== value.trim()) { errors.confirmPassword = "Пароли не совпадают"; }
  // else { errors.confirmPassword = ""; }

  // сброс sms
  // errors.sms = "";

  // ^ проверка разности email и password (не должны совпадать или быть похожими)
  // if (errors.email === errors.password) {
  //   console.log("errors.email ", errors.email);
  //   console.log("errors.password ", errors.password);
  //   const strErr = `Не должны совпадать ${errors.email} и ${errors.password}`;
  //   errors.email = strErr;
  //   errors.password = strErr;
  // } else {
  //   errors.email = "";
  //   errors.password = "";
  // }
  // ^ проверка уникальности. не должно быть простых комбинаций, последовательных знаков/букв

  // Проверка name
  // const patternPHN = /^((8|\+7)[\\- ]?)?(\(?\d{3}\)?[\\- ]?)?[\d\- ]{7,10}$/i;
  if (name === "phone") {
    // errors.phone =
    //   // value.phone.trim();
    //   patternPHN.test(value.phone);
    if (!(/* formValues.password */ value.trim())) {
      errors.phone = "Поле обязательно для заполнения";
    } else {
      errors.phone = "";
    }
  }

  // Проверка адреса
  if (name === "address") {
    if (!value.trim()) {
      errors.address = "Поле обязательно для заполнения";
    } else {
      errors.address = "";
    }
  }

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const renderValue = (
  value: any,
  validationArr?: any,
  formErrors?: any,
  setFormErrors?: any,
  handleChange?: any,
  handleSubmit?: any,
  MsgBtn?: any,
  label?: any,
  legend?: any,
  formClass?: any,
  fieldClass?: any,
  body?: any,
  axis?: any
): React.ReactNode => {
  // отслеживание/валидация ввода
  const handleChangeValidation = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    validateForm(name, value, formErrors, setFormErrors);
    handleChange(event);
  };

  if (typeof value === "string") {
    return (
      <input
        name={value[0]}
        onChange={handleChange}
        // onChange={handleChangeValidation}
        value={value}
      />
    );
  }

  // е/и есть влож.масс.
  if (Array.isArray(value)) {
    // ^ не объединённые (ununited)
    if (
      value.length === 2 &&
      typeof value[0] === "string" &&
      typeof value[1] === "string"
    ) {
      return (
        <>
          <div
            className={`${
              axis === "row"
                ? label
                  ? "axis++lb w-100 ml-5"
                  : "axis--lb w-100 ml-5"
                : label
                ? "ununited w-100 mt-3"
                : "ununited w-100 mt-3"
            } ${fieldClass ? fieldClass : ""}`}
          >
            <div className="df df-aic">
              {label && (
                <label
                  htmlFor={value[0]}
                  className={`${label ? "w-5 tal mr-3" : ""}`}
                >
                  {value[0]}
                </label>
              )}
              <input
                id={value[0]}
                type="text"
                name={value[0]}
                value={value[1]}
                // onChange={handleChange}
                onChange={(event) => handleChangeValidation(event)}
                className={`inpt--eg ${
                  axis === "row"
                    ? label
                      ? "axis w-100 ml-3"
                      : "axis w-100"
                    : label
                    ? "w-100 ml-3"
                    : "w-100"
                } 
                ${
                  formErrors[value[0]]
                    ? "err-inpt"
                    : !formErrors[value[0]]
                    ? "err-inpt-suces"
                    : ""
                } 
                `}
                placeholder={`Отсутствуете ${value[0]}`}
              />
            </div>
            {
              // formErrors[value[0]] === false ||
              // formErrors[value[0]] !== null ||
              formErrors[value[0]] !== "" && (
                <>
                  <div className="error">{formErrors[value[0]]}</div>
                </>
              )
            }
          </div>
        </>
      );
    }

    // ^ объединённые (united)
    if (isNestedValue(value)) {
      return (
        <>
          <div className="united df df-row df-jcsb mt-3">
            {value.map((subValue: any, index) => (
              <React.Fragment key={index}>
                {renderValue(
                  subValue,
                  validationArr,
                  formErrors,
                  setFormErrors,
                  handleChange,
                  handleSubmit,
                  MsgBtn,
                  label,
                  legend,
                  formClass,
                  fieldClass,
                  body,
                  (axis = "row")
                )}
              </React.Fragment>
            ))}
          </div>
        </>
      );
    }
  }

  return null;
};

const isNestedValue = (value: Value): value is NestedValue => {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    Array.isArray(value[0]) &&
    Array.isArray(value[1])
  );
};

const FormFieldRecursive__EG: React.FC<Props> = ({
  valueArr, // массив значений
  validationArr, // валидация input
  handleChange, // обраб.измененийhandle
  handleSubmit, // кнп.обраб. формы
  MsgBtn, // СМС кнп.обраб. форме
  label, // подпись input
  legend, // подпись/вкл. набора полей
  formClass,
  fieldClass, // класс для набора полей
  body, // альтернатива valueObj (Компонент/текст)
  axis = "col", // направление оси расположения эл.(по умолч.вертикально)
}) => {
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: "",
    email: "",
    phone: "",
    address: "",
    comment: "",
    sms: "",
    password: "",
  });

  return (
    <form
      className={`form ${formClass ? formClass : ""}`}
      onSubmit={handleSubmit}
    >
      <fieldset
        className={`fieldset--eg df ${
          axis === "row" ? "df-row df-jcsb" : "df-col"
        } ${!legend ? "bbb-0" : "p-4 pt-3"}`}
      >
        {legend && <legend className="legend--eg">{legend}</legend>}
        {valueArr.map((value: any, index: any) => (
          <React.Fragment key={index}>
            {renderValue(
              value,
              validationArr,
              formErrors, // state валидации/ошб.
              setFormErrors, // измен.валидации/ошб.
              handleChange,
              handleSubmit,
              MsgBtn,
              label,
              legend,
              formClass,
              fieldClass,
              body,
              axis
            )}
            {/* {validationArr[index] && <span className="error">Ошибка!</span>} */}
          </React.Fragment>
        ))}
        {handleSubmit !== false && handleSubmit !== undefined && (
          <button
            type="submit"
            className={`btn--eg btn-${
              MsgBtn === "Удалить" ? "danger" : "primary"
            }--eg  ${!axis || axis === "col" ? "mt-3" : "ml-3"}`}
          >
            {MsgBtn}
          </button>
        )}
      </fieldset>
    </form>
  );
};

export default FormFieldRecursive__EG;
