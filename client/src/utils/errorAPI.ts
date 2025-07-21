// ^ дополнительный класс обработки типизированных ошибок

import { AxiosError } from "axios";

export class ApiError extends Error {
  constructor(
    public status: number = 500,
    public message: string = "Неизвестная ошибка",
    public code: string = "UNKNOWN_ERROR",
    public errors?: Record<string, unknown>,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
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
}
