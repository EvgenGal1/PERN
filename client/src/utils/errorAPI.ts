// ^ дополнительный класс обработки типизированных ошибок

import { AxiosError } from "axios";

/**
 * @file ApiError.ts
 * @description Класс типизированной ошибки API. Используется для унификации обработки ошибок
 *              во всем приложении, включая ошибки сети, сервера и бизнес-логики.
 *              Предоставляет структурированный доступ к коду ошибки, сообщению и дополнительным данным.
 */

/**
 * @class ApiError
 * @extends Error
 * @description Расширенный класс ошибки для представления ошибок API.
 *              Содержит HTTP-статус, уникальный код ошибки, сообщение и дополнительные данные.
 *              Может быть создан как напрямую, так и из AxiosError.
 *
 * @example
 * // Создание ошибки вручную
 * throw new ApiError(404, "Пользователь не найден", "USER_NOT_FOUND");
 *
 * @example
 * // Создание ошибки из AxiosError
 * const apiError = ApiError.fromAxiosError(axiosError);
 */
export class ApiError extends Error {
  /**
   * @constructor
   * @param {number} [status=500] - HTTP статус ошибки (например, 404, 500).
   * @param {string} [message="Неизвестная ошибка"] - Человекочитаемое сообщение об ошибке.
   * @param {string} [code="UNKNOWN_ERROR"] - Уникальный код ошибки для программной идентификации.
   * @param {Record<string, unknown>} [errors] - Объект с деталями ошибок по полям (например, валидация).
   * @param {any} [details] - Любые дополнительные данные, связанные с ошибкой.
   *
   * @example
   * const error = new ApiError(
   *   400,
   *   "Некорректные данные",
   *   "VALIDATION_ERROR",
   *   { email: "Некорректный формат email" },
   *   { userId: 123 }
   * );
   */
  constructor(
    public readonly status: number = 500,
    public readonly message: string = "Неизвестная ошибка",
    public readonly code: string = "UNKNOWN_ERROR",
    public readonly errors?: Record<string, unknown>,
    public readonly details?: any
  ) {
    super(message);
    // для логов/отладки
    this.name = "ApiError";
    // Object.setPrototypeOf(this, ApiError.prototype);
    // проверка доступности stack
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * @method toJSON
   * @description Преобразует объект ошибки в обычный JavaScript объект для сериализации.
   *              Полезно для логирования или отправки на клиент.
   *              Свойство `stack` не включается в production.
   *
   * @returns {Object} Объект с полями ошибки.
   * @property {number} status - HTTP статус.
   * @property {string} message - Сообщение об ошибке.
   * @property {string} code - Код ошибки.
   * @property {Record<string, unknown>} [errors] - Детали ошибок по полям.
   * @property {any} [details] - Дополнительные данные.
   * @property {string} [stack] - Stack trace (только в development).
   */
  toJSON() {
    return {
      status: this.status,
      message: this.message,
      code: this.code,
      ...(this.details && { details: this.details }),
      ...(this.errors && { errors: this.errors }),
      // подроб.в development
      stack: process.env.NODE_ENV === "development" ? this.stack : undefined,
    };
  }

  // статич.мтд. > созд.экземпл.AxiosError из ошб.Axios
  /**
   * @static
   * @method fromAxiosError
   * @description Создаёт экземпляр `ApiError` из ошибки Axios.
   *              Извлекает статус, сообщение и код из ответа сервера.
   *
   * @param {import('axios').AxiosError} error - Ошибка от библиотеки Axios.
   * @returns {ApiError} Новый экземпляр `ApiError`.
   *
   * @example
   * try {
   *   await axios.get('/api/user');
   * } catch (axiosError) {
   *   const apiError = ApiError.fromAxiosError(axiosError);
   *   console.error(apiError.message);
   * }
   */
  static fromAxiosError(error: AxiosError): ApiError {
    const data = error.response?.data as any;
    return new ApiError(
      error.response?.status || 500,
      data?.message || error.message,
      data?.code || "NETWORK_ERROR",
      data?.errors,
      data?.details
    );
  }
}
