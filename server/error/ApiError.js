// универс.обраб.ошиб.(handler)

// класс для объедин. неск.мтд. Кл.расшир.Error
class ApiError extends Error {
  // формат/последовательность выгрузки
  status; /* : number; */
  message; /* : string; */
  errors; /* : any; */

  // в парам.приним. стат.код, смс, ошб.(по умолч.масс.пуст)
  constructor(status /* : number */, message /* : string */, errors = []) {
    // вызов.род.констр. с передачей смс
    super();
    // super(message); // ! не раб. формат или присвойка без указания
    // присвойка полученого в экземпляр кл.
    this.status = status;
    this.message = message;
    this.errors = errors;
  }

  // СОЗД.СТАТИЧ.fn (можно вызыв.без созд.объ.обращ.на прямую к кл.)

  // `Несанкционированная ошибка`
  static UnauthorizedError(message /* : string */, errors = []) {
    // возвращ.экземпл.текущ.кл.
    return new ApiError(401, `Пользователь не авторизован. ${message}`, errors);
  }

  // `плохой запрос`
  static BadRequest(message /* : string */, errors = []) {
    // возвращ.нов.объ.(экземпляр)с парам.(код,смс,ошб)
    return new ApiError(400, message, errors);
  }

  // `внутренний`
  static internal(message /* : string */, errors = []) {
    return new ApiError(500, message, errors);
  }

  // `запрещенный` нет доступа
  static forbidden(message /* : string */, errors = []) {
    return new ApiError(403, message, errors);
  }
}

module.exports = ApiError;
