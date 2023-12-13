// универс.обраб.ошиб.(handler)
// export {};

// класс для объедин. неск.мтд. Кл.расшир.Error
class ApiError extends Error {
  status: number;
  message: string;
  errors?: any;

  // в парам.приним. стат.код, смс, ошб.(по умолч.масс.пуст)
  constructor(status: number, message: string, errors: any = [] || "") {
    // вызов.род.констр. с передачей смс
    super();
    // super(message); // ! не раб. формат или присвойка без указания
    // присвойка полученого в экземпляр кл.
    this.status = status;
    this.message = message;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  // СОЗД.СТАТИЧ.fn (можно вызыв.без созд.объ.обращ.на прямую к кл.)

  // `Несанкционированная ошибка`
  static unauthorizedError(message: string) {
    // возвращ.экземпл.текущ.кл.
    return new ApiError(401, message);
  }

  // `плохой запрос`
  static badRequest(message: string, errors = [] || "") {
    // возвращ.нов.объ.(экземпляр)с парам.(код,смс,ошб)
    return new ApiError(400, message, errors);
  }

  // `внутренняя ошибка сервера`
  static internalServerError(message: string) {
    return new ApiError(500, message);
  }

  // `запрещенный`
  static forbidden(message: string) {
    return new ApiError(403, message);
  }
}

export default ApiError;
