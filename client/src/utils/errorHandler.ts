// ^ основной обработчик ошибок (axios/req/res c БД, спец.доп.ошб., натив.ошб.JS, неизвестные ошб.)

import { AxiosError } from "axios";
// логгирование
// import * as Sentry from "@sentry/react";

import { APIError } from "./errorClasses";
import { authAPI } from "../api/auth/authAPI";

export interface ApiError {
  status: number;
  message: string;
  code: string;
  errors?: Record<string, unknown>;
}

export const errorHandler = (error: unknown, context?: string): ApiError => {
  // баз.объ.ошб.
  const baseError = {
    status: 500,
    message: "Неизвестная ошибка",
    code: "UNKNOWN_ERROR",
  };
  // логг.Sentry
  // if (process.env.NODE_ENV === "production") Sentry.captureException(error, { tags: { context } });
  // Логирование контекста
  console.error(`errorHandler [${context}] ОШБ: `, error);

  // обраб.ошб.axios
  if (error instanceof AxiosError) {
    // ошб.сетевые (нет ответа)
    if (!error.response) {
      return {
        status: 503,
        message: "Сервер недоступен",
        code: "NETWORK_ERROR",
      };
    }

    // ошб.от БД
    const { status, data } = error.response;
    const responseData = data as ApiError;

    // при 401 Выход Пользователя и редирект на Авторизацию
    if (status === 401) {
      authAPI.logout();
      window.location.href = "auth/login";
      // localStorage.removeItem("tokenAccess");
      // window.location.href = "/login";
    }

    return {
      status,
      message: responseData?.message || "Неизвестная ошибка",
      errors: responseData?.errors,
      code: responseData?.code || "UNKNOWN_ERROR",
    };
  }

  // спец.доп.ошб.
  if (error instanceof APIError) {
    return {
      status: error.status,
      message: error.message,
      code: error.code,
      errors: error.errors,
    };
  }

  // натив.ошб.JS
  if (error instanceof Error) return { ...baseError, message: error.message };

  // Неизвестные ошибки
  return baseError;
};
