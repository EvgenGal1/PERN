// универс.обраб.ошиб.(handler)

// класс для объедин. неск.мтд. Кл.расшир.Error
class ApiError extends Error {
  // в парам.приним. стат.код и смс
  constructor(status, message) {
    // вызов.род.констр.
    super();
    // присвойка полученого
    this.status = status;
    this.message = message;
  }

  // СОЗД.СТАТИЧ.fn (можно вызыв.без созд.объ.обращ.на прямую к кл.)

  // `плохой запрос`
  static badRequest(message) {
    // возвращ.нов.объ.с парам.(код и смс)
    return new ApiError(404, message);
  }

  // `внутренний`
  static internal(message) {
    return new ApiError(500, message);
  }

  // `запрещенный` нет доступа
  static forbidden(message) {
    return new ApiError(403, message);
  }
}

module.exports = ApiError;
