// ^ клс.польз-их ошб./исключ.с разн.статусами - throw ApiError.notFound('Ресурс не найден')

// класс для объедин. неск.мтд. Кл.расшир.Error
class ApiError extends Error {
  // указ.св-в (стат.код,смс,ошб)
  status: number;
  message: string;
  errors?: any;

  // в парам.приним. стат.код, смс, ошб.(по умолч.масс.пуст)
  constructor(status: number, message: string, errors: any = null) {
    super(message); // вызов.род.клс.констр. с передачей смс
    // присвойка полученого в экземпляр кл.
    this.status = status;
    this.message = message; // сохр.смс
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  // статич.мтд. (можно вызыв.без созд.объ.обращ.на прямую к кл.)

  // `плохой запрос`
  static badRequest(message: string, errors: any = null) {
    // возвращ.нов.объ.(экземпляр)с парам.(код,смс,ошб)
    return new ApiError(400, message, errors);
  }

  // `несанкционированная ошибка`
  static unauthorized(message: string) {
    // возвращ.экземпл.текущ.кл.
    return new ApiError(401, message);
  }

  // `запрещенный`
  static forbidden(message: string) {
    return new ApiError(403, message);
  }

  // `не найдено`
  static notFound(message: string) {
    return new ApiError(404, message);
  }

  // `внутренняя ошибка сервера`
  static internal(message: string) {
    return new ApiError(500, message);
  }
}

export default ApiError;
