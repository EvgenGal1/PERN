// ^ доп.fn обраб.ошб./исключ. - throwError(400, 'Некорректный запрос')

import ApiError from '../middleware/errors/ApiError';

/**
 * Выбрасывает исключение с указанным статусом.
 * @param status Код статуса HTTP.
 * @param message Сообщение об ошибке.
 * @param errors Дополнительные детали ошибки.
 */
export function throwError(
  status: number,
  message: string,
  errors: any = null,
) {
  switch (status) {
    case 400:
      throw ApiError.badRequest(message, errors);
    case 401:
      throw ApiError.unauthorized(message);
    case 403:
      throw ApiError.forbidden(message);
    case 404:
      throw ApiError.notFound(message);
    default:
      throw ApiError.internal(message);
  }
}
