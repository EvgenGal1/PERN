// ^ дополнительный класс обработки типизированных ошибок

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code: string,
    public errors?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  toJSON() {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      ...(this.errors && { errors: this.errors }),
    };
  }
}
