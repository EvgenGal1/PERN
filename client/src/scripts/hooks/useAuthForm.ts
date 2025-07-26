import { useState, useCallback } from "react";

import type { FormErrors, LoginCredentials } from "@/types/auth.types";

// ^ будущ.дораб. > username/проверка password при Регистрации
type AuthCredential = LoginCredentials & {
  username?: string;
  confirmPassword?: string;
};
type AuthFormErrors = FormErrors & {
  username?: string;
  confirmPassword?: string;
};

export const useAuthForm = (
  initialValues: AuthCredential,
  isLogin: boolean
) => {
  // сост. формы, ошб.валидации, флаг отправки формы
  const [credentials, setCredentials] = useState<AuthCredential>(initialValues);
  const [errors, setErrors] = useState<AuthFormErrors>({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
    sms: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // валид.email
  const validateEmail = useCallback((email: string): string => {
    // Упрощенная валидация
    if (!email) return "Email обязателен";
    if (!email.trim()) return "Поле обязательно для заполнения";
    if (/[а-яА-Я]/.test(email)) {
      return `Email должен содержать буквы латиницы - ${email}`;
    }
    if (!email.includes("@")) return "Отсутствует символ @";
    if (!email.includes(".")) {
      return "Нет разделителя почт.серв. и домена в виде точки(.)";
    }
    // > проверки наличия имени перед символом @
    let [emailName, emailDomain] = "";
    if (email.includes("@")) [emailName, emailDomain] = email.split("@");
    // > проверки наличия доменного имени почтового сервиса (mail|yandex|google) и домена первого уровня (ru|com|org|net)
    let emailService: string | undefined, topLevelDomain: string | undefined;
    if (email.includes(".")) {
      emailService = emailDomain.split(".").shift();
      topLevelDomain = emailDomain.split(".").pop();
    }
    if (emailName.length === 0) return "Отсутствует Имя перед символом @";
    if (!emailService)
      return "Отсутствует почтовый сервис (mail|yandex|google) после @ и перед .";
    // ! распознает как цифры, cg при наборе "а" - xn--test-83d
    if (/[а-яА-Я]/.test(emailService)) {
      return "Домен почтового сервиса должен быть на латинице";
    }
    if (/[0-9]/.test(emailService)) {
      return "Домен почтового сервиса не должен содержать цифр";
    }
    if (/[!@#$%^&*]/.test(emailService)) {
      return "Домен почтового сервиса не должен содержать символы";
    }
    if (!/[a-z]{2,8}/.test(emailService)) {
      return "Домен почтового сервиса слишком короткий";
    }
    if (emailService.length > 8) {
      return "Домен почтового сервиса слишком длинный";
    }
    if (!topLevelDomain) {
      return "Нет домена первого уровня (ru|com|org|net)";
    }
    if (/[0-9]/.test(topLevelDomain)) {
      return "Домен первого уровня не должен содержать цифр";
    }
    if (!/[a-z]{2,4}/.test(topLevelDomain)) {
      return "Домен первого уровня слишком короткий";
    }
    if (topLevelDomain.length > 4) {
      return "Домен первого уровня слишком длинный";
    }
    if (/(?=.*\s)/.test(email)) {
      return "Email не должен содержать пробелов";
    }
    if (!/^[\w-.@]+@[a-z]{2,8}\.[a-z]{2,4}$/i.test(email)) {
      return "Email не соответствует формату имя@сервис.домен";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Некорректный формат email";
    }
    //  ----------------------------------------------------------------------------------
    return "";
  }, []);

  // валид.пароля
  const validatePassword = useCallback((password: string): string => {
    if (!password) return "Пароль обязателен";
    if (!password.trim()) return "Поле обязательно для заполнения";
    if (password.trim().length < 6) {
      return "Пароль должен содержать не менее 6 символов";
    }
    if (/[а-яА-Я]/.test(password)) {
      return `Пароль должен содержать буквы литиницы - ${password}`;
    }
    if (!/[a-z]/.test(password)) {
      return `Пароль должен содержать хотя бы одну строчную букву - ${password}`;
    }
    if (!/[A-Z]/.test(password)) {
      return `Пароль должен содержать хотя бы одну заглавную букву - ${password}`;
    }
    if (!/(?=.*\d)/.test(password)) {
      return `Пароль должен содержать хотя бы одну цифру - ${password}`;
    }
    if (!/(?=(.*\W){2})/.test(password) /* && !/[!@#$%^&*]/.test(password) */) {
      return `Пароль должен содержать как минимум 2 специальных символа - ${password}`;
    }
    if (/(?=.*\s)/.test(password)) {
      return `Пароль не должен содержать пробелов - ${password}`;
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=(.*\W){2})[a-zA-Z\d\W]{6,}$/.test(
        password
      )
    ) {
      return "Пароль должен содержать минимум одну цифру/заглавную/строчную букву, два спец.символа";
    }
    return "";
  }, []);

  // валидация username
  const validateUsername = useCallback((username: string): string => {
    if (!username) return "Имя пользователя обязательно";
    if (username.length < 3) return "Минимум 3 символа";
    if (username.length > 20) return "Максимум 20 символов";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Только латинские буквы, цифры и _";
    }
    return "";
  }, []);

  // валид.подтверждения паролz
  const validateConfirmPassword = useCallback(
    (confirmPassword: string, password: string): string => {
      if (!confirmPassword) return "Подтвердите пароль";
      if (confirmPassword !== password) return "Пароли не совпадают";
      return "";
    },
    []
  );

  // ^ проверка разности email и password (не должны совпадать или быть похожими)
  // if (errors.email === errors.password) {
  //   const strErr = `Не должны совпадать ${errors.email} и ${errors.password}`;
  //   errors.email = strErr;  errors.password = strErr;  }
  // else {  errors.email = "";  errors.password = "";  }
  // ^ проверка уникальности. не должно быть простых комбинаций, последовательных знаков/букв

  // валид.значения по имени
  const validateField = useCallback(
    (name: keyof AuthCredential, value: string): string => {
      switch (name) {
        case "email":
          return validateEmail(value);
        case "password":
          return validatePassword(value);
        case "username":
          return validateUsername(value);
        case "confirmPassword":
          return validateConfirmPassword(value, credentials.password);
        default:
          return "";
      }
    },
    [
      validateUsername,
      validateEmail,
      validatePassword,
      validateConfirmPassword,
      credentials.password,
    ]
  );

  // обраб.измен.полей с валид.
  const handleChange = useCallback(
    // (name: keyof AuthCredential, value: string) => {
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCredentials((prev) => ({ ...prev, [name]: value }));
      // cброс ошб.БД при изменении
      setErrors((prev) => ({ ...prev, [name]: "", sms: "" }));
      // валидация клиентских ошб.
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name as keyof AuthCredential, value),
      }));
    },
    [validateField]
  );

  // валид.всей формы
  const validateForm = useCallback((): boolean => {
    const newErrors = {
      email: validateEmail(credentials.email),
      password: validatePassword(credentials.password),
      username: isLogin ? "" : validateUsername(credentials.username || ""),
      confirmPassword: isLogin
        ? ""
        : validateConfirmPassword(
            credentials.confirmPassword || "",
            credentials.password
          ),
      sms: "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err !== "");
  }, [credentials, validateEmail, validatePassword]);

  // сброс формы
  const resetForm = () => {
    setCredentials(() => ({ email: "", password: "" }));
  };

  return {
    credentials,
    errors,
    isSubmitting,
    setErrors,
    setIsSubmitting,
    handleChange,
    validateForm,
    resetForm,
  };
};
