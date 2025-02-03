// ^ обработчик ошибок запросов(axios/req/res) к БД

import { AxiosError } from "axios";
// логгирование
// import * as Sentry from "@sentry/react";

import { logout } from "../api/auth/authAPI";
import { ErrorRes } from "../types/api/auth.types";

export const handlerApiErrors = (error: AxiosError): ErrorRes => {
  // Логирование в Sentry
  // Sentry.captureException(error);

  // ошб.без ответа сервера
  if (!error.response) {
    console.error("ApiError Network Err : ", error.message);
    return {
      status: 503,
      message: "Сервер недоступен",
      code: "NETWORK_ERROR",
    };
  }

  const { status, data } = error.response;
  const responseData = data as {
    message?: string;
    errors?: Record<string, unknown>;
    code?: string;
  };

  // при 401 Выход Пользователя и редирект на Авторизацию
  if (status === 401) {
    logout();
    window.location.href = "auth/login";
  }

  // объ.ошб.
  const apiError: ErrorRes = {
    status,
    message: responseData?.message || "Неизвестная ошибка",
    errors: responseData?.errors,
    code: responseData?.code || "UNKNOWN_ERROR",
  };

  console.error("API Error:", apiError);
  return apiError;
};
