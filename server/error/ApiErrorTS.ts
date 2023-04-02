// универс.обраб.ошиб.(handler)
export {};

// класс для объедин. неск.мтд. Кл.расшир.Error
class ApiErrorTS extends Error {
  // формат/последовательность выгрузки
  status: number;
  message: string;
  errors: any;

  // в парам.приним. стат.код, смс, ошб.(по умолч.масс.пуст)
  constructor(status: number, message: string, errors = []) {
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
  static UnauthorizedError(message: string, errors = []) {
    // возвращ.экземпл.текущ.кл.
    return new ApiErrorTS(
      401,
      `Пользователь не авторизован. ` /* ${message} ,
      errors */
    );
  }

  // `плохой запрос`
  static BadRequest(message: string, errors = []) {
    // возвращ.нов.объ.(экземпляр)с парам.(код,смс,ошб)
    return new ApiErrorTS(400, message, errors);
  }

  // `внутренний`
  static internal(message: string, errors = []) {
    return new ApiErrorTS(500, message, errors);
  }

  // `запрещенный` нет доступа
  static forbidden(message: string, errors = []) {
    return new ApiErrorTS(403, message, errors);
  }
}

module.exports = ApiErrorTS;
export default ApiErrorTS;
