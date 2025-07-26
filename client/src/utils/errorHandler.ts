// ^ основной обработчик ошибок (axios/req/res c БД, спец.доп.ошб., натив.ошб.JS, неизвестные ошб.)

import { AxiosError, isAxiosError } from "axios";
// логгирование
// import * as Sentry from "@sentry/react";

import { ApiError } from "./errorAPI";

export const errorHandler = (error: unknown, context?: string): ApiError => {
  // логг.Sentry
  // if (process.env.NODE_ENV === "production") Sentry.captureException(error, { tags: { context } });
  // Логирование контекста
  console.error(`errorHandler [${context}] ОШБ: `, error);

  // обраб.ошб.axios
  if (isAxiosError(error)) {
    // ответ от БД, обраб.ошб.
    const response = error.response;
    // ошб.сетевые (нет ответа)
    if (!response) {
      return new ApiError(503, "Сервер недоступен", "NETWORK_ERROR", { error });
    }

    // при 401 Выход Пользователя
    // if (response.status === 401) UserStore.prototype.logout();

    // ошб.БД формата ApiError
    if (response?.data?.error) {
      return new ApiError(
        response.status,
        response.data.error.message,
        response.data.error.code,
        undefined,
        response.data.error.details
      );
    }
    // стандарт ошб.БД
    return new ApiError(
      response.status,
      response.data?.message || error.message || "нестандартная ошибка",
      response.data?.code || "SERVER_ERROR"
    );
  }

  // спец.доп.ошб.
  if (error instanceof ApiError) return error;
  // натив.ошб.JS
  if (error instanceof Error) return new ApiError(500, error.message);
  // неизвестные ошб.
  return new ApiError(500, "Неизвестная ошибка", "UNKNOWN_ERROR", {
    originalError: error,
  });
};
