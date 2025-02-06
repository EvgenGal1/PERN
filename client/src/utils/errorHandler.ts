// ^ основной обработчик ошибок (axios/req/res c БД, спец.доп.ошб., натив.ошб.JS, неизвестные ошб.)

import { AxiosError } from "axios";
// логгирование
// import * as Sentry from "@sentry/react";

import { ApiError } from "./errorClasses";
import { authAPI } from "../api/auth/authAPI";

export const errorHandler = (error: unknown, context?: string): ApiError => {
  // баз.объ.ошб.
  const baseError = new ApiError("Неизвестная ошибка", 500, "UNKNOWN_ERROR");
  // логг.Sentry
  // if (process.env.NODE_ENV === "production") Sentry.captureException(error, { tags: { context } });
  // Логирование контекста
  console.error(`errorHandler [${context}] ОШБ: `, error);

  // обраб.ошб.axios
  if (error instanceof AxiosError) {
    // ошб.сетевые (нет ответа)
    if (!error.response) {
      return new ApiError("Сервер недоступен", 503, "NETWORK_ERROR", { error });
    }

    // ошб.от БД
    const { status, data } = error.response;
    const responseData = data as ApiError;

    // при 401 Выход Пользователя и редирект на Авторизацию
    if (status === 401) {
      authAPI.logout();
      window.location.href = "auth/login";
    }

    return {
      status,
      message: responseData?.message || "Неизвестная ошибка",
      errors: responseData?.errors,
      code: responseData?.code || "UNKNOWN_ERROR",
    } as ApiError;
  }

  // спец.доп.ошб.
  if (error instanceof ApiError) return error;
  // натив.ошб.JS
  if (error instanceof Error)
    return { ...baseError, message: error.message } as ApiError;
  // неизвестные ошб.
  return baseError;
};
