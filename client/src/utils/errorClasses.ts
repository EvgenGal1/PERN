// ^ дополнительный класс обработки типизированных ошибок

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public errors?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, APIError.prototype);
  }
}
