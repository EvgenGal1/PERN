// ^ дополнительный класс обработки типизированных ошибок

import { AxiosError } from "axios";

export class ApiError extends Error {
  constructor(
    // ^ в боте есть переделка
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

  // статич.мтд. > созд.из AxiosError
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
