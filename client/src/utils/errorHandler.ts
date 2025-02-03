// ^ обработчик ошибок запросов(axios/req/res) к БД

import { AxiosError } from "axios";
// логгирование
// import * as Sentry from "@sentry/react";

import { logout } from "../api/auth/authAPI";
import { ErrorRes } from "../Components/ErrorBoundary/ErrorBoundary";

export const errorHandler = (error: unknown): ErrorRes => {
  // Логирование в Sentry
  // Sentry.captureException(error);

  // обраб.ошб.axios
  if (error instanceof AxiosError) {
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

    return {
      status,
      message: responseData?.message || "Неизвестная ошибка",
      errors: responseData?.errors,
      code: responseData?.code || "UNKNOWN_ERROR",
    };
  }

  // обраб.ошб. Error
  if (error instanceof Error) {
    // объ.ошб.
    return {
      status: 500,
      message: error.message,
      code: "INTERNAL_ERROR",
    };
  }

  // Неизвестные ошибки
  return {
    status: 500,
    message: "Неизвестная ошибка",
    code: "UNKNOWN_ERROR",
  };
};
