class ApiError extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    // this.message = message;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  // СОЗД.СТАТИЧ.fn (можно вызыв.без созд.объ.обращ.на прямую к кл.)

  // `Несанкционированная ошибка`
  static UnauthorizedError(message: string) {
    // возвращ.экземпл.текущ.кл.
    return new ApiError(401, message);
  }

  static badRequest(message: string) {
    return new ApiError(404, message);
  }

  static internalServerError(message: string) {
    return new ApiError(500, message);
  }

  static forbidden(message: string) {
    return new ApiError(403, message);
  }
}

export default ApiError;
