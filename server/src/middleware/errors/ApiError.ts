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

  // статич.мтд.созд.объ.ошб. (мжн.вызов.без созд.объ.обращ.на прямую к кл.)

  // `не изменён`
  static notModified(message: string): ApiError {
    return new ApiError(304, message);
  }

  // `плохой запрос`
  static badRequest(message: string, errors: any = null): ApiError {
    // возвращ.нов.объ.(экземпляр)с парам.(код,смс,ошб)
    return new ApiError(400, message, errors);
  }

  // `несанкционирован`/не авторизован
  static unauthorized(message: string): ApiError {
    // возвращ.экземпл.текущ.кл.
    return new ApiError(401, message);
  }

  // `запрещенный`/нет доступа
  static forbidden(message: string): ApiError {
    return new ApiError(403, message);
  }

  // `не найдено`
  static notFound(message: string): ApiError {
    return new ApiError(404, message);
  }

  // `конфликт` данных
  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }

  // `необработанный`/невалид.данн.
  static unprocessable(message: string, errors: any = null): ApiError {
    return new ApiError(422, message, errors);
  }

  // `много запросов` */
  static manyRequests(message: string): ApiError {
    return new ApiError(429, message);
  }

  // `внутренняя` ошб.сервера
  static internal(message: string): ApiError {
    return new ApiError(500, message);
  }
}

export default ApiError;
