// ^ основной обработчик ошибок (axios/req/res c БД, спец.доп.ошб., натив.ошб.JS, неизвестные ошб.)

import { isAxiosError } from "axios";
// логгирование
// import * as Sentry from "@sentry/react";

import { ApiError } from "./errorAPI";

/**
 * @function errorHandler
 * @description Универсальная функция для обработки и нормализации ошибок.
 *              Превращает любую ошибку в экземпляр `ApiError` для единообразной обработки.
 *
 * @param {unknown} error - Любая ошибка, которую нужно обработать.
 * @param {string} [context] - Контекст, в котором произошла ошибка (например, имя метода).
 * @returns {ApiError} Нормализованный объект ошибки типа `ApiError`.
 *
 * @example
 * try {
 *   await someAsyncOperation();
 * } catch (error) {
 *   const apiError = errorHandler(error, "UserService.fetchUser");
 *   console.error("Код ошибки:", apiError.code);
 *   console.error("Сообщение:", apiError.message);
 * }
 *
 * @example
 * // Обработка ошибки сети
 * // Вход: Network Error (from Axios)
 * // Выход: new ApiError(503, "Сервер недоступен", "NETWORK_ERROR")
 */
export const errorHandler = (error: unknown, context?: string): ApiError => {
  // логг.Sentry
  // if (process.env.NODE_ENV === "production") Sentry.captureException(error, { tags: { context } });

  // общ.тип ошб.
  let apiError: ApiError;

  // обраб.ошб.axios
  if (isAxiosError(error)) {
    // ответ от БД, обраб.ошб.
    const response = error.response;
    // ошб.сетевые (нет ответа)
    if (!response) {
      apiError = new ApiError(503, "Сервер недоступен", "NETWORK_ERROR", {
        error,
      });
    }
    // ошб.БД формата ApiError
    else if (response?.data?.error) {
      apiError = new ApiError(
        response.status,
        response.data.error.message,
        response.data.error.code,
        undefined,
        response.data.error.details
      );
    }
    // стандарт ошб.БД
    else {
      apiError = new ApiError(
        response.status,
        response.data?.message || error.message || "нестандартная ошибка",
        response.data?.code || "API_ERROR"
      );
    }
  }

  // спец.доп.ошб.
  else if (error instanceof ApiError) apiError = error;
  // натив.ошб.JS
  else if (error instanceof Error) {
    apiError = new ApiError(500, error.message, "JS_ERROR");
  }
  // неизвестные ошб.
  else {
    apiError = new ApiError(500, "Неизвестная ошибка", "UNKNOWN_ERROR", {
      originalError: error,
    });
  }

  // общ.логг.ошб.
  console.error(`errorHandler [${context}] ОШБ.:`, apiError.message);

  return apiError;
};
