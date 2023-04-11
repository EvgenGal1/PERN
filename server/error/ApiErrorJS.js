// универс.обраб.ошиб.(handler)

// класс для объедин. неск.мтд. Кл.расшир.Error
module.exports = class ApiErrorJS extends Error {
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
    // console.log("SRV.ApiErrJS constructor ", 000123);
  }

  // СОЗД.СТАТИЧ.fn (можно вызыв.без созд.объ.обращ.на прямую к кл.)

  // `Несанкционированная ошибка`
  static UnauthorizedError /* message */() {
    /* : string */
    /* , errors = [] */
    // возвращ.экземпл.текущ.кл.
    return new ApiErrorJS(
      401,
      `Пользователь не авторизован. ${message}`
      // errors
    );
  }

  // `плохой запрос`
  static BadRequest(message /* : string */, errors = []) {
    // возвращ.нов.объ.(экземпляр)с парам.(код,смс,ошб)
    // /* return */ new ApiErrorJS(400, message, errors);
    console.log("SRV.ApiErrJS BadRequest 3 err ", errors);
    console.log(
      "SRV.ApiErrJS BadRequest 4 msg|err ",
      "err " + errors,
      "msg " + message
    );
    // ! ошб. выводит cg и падает в cg SRV.a.cntrl registr catch и undf reading 'refr|tokens'
    return new ApiErrorJS(400, message, errors);
  }

  // `внутренний`
  static internal(message /* : string */, errors = []) {
    console.log("SRV.ApiErrJS internal ", 234);
    return new ApiErrorJS(500, message, errors);
  }

  // `запрещенный` нет доступа
  static forbidden(message /* : string */, errors = []) {
    return new ApiErrorJS(403, message, errors);
  }
};

// module.exports = ApiErrorJS;
// const apiErrorInstance = new ApiErrorJS();
