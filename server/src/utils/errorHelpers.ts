// ^ доп.fn обраб.ошб./исключ. - throwError(400, 'Некорректный запрос')

import ApiError from '../middleware/errors/ApiError';

/**
 * выброс ошибки HTTP со статусом
 * @param status Код статуса HTTP
 * @param message Сообщение об ошибке
 * @param errors Доп.детали ошибки (строка/объект/Error)
 */
export const throwError = (
  status: number,
  message: string,
  errors: unknown | null = null,
): never => {
  // выброс.ошб.ApiError
  if (errors instanceof ApiError) throw errors;

  // станд.ApiError
  switch (status) {
    case 400:
      throw ApiError.badRequest(message, errors);
    case 401:
      throw ApiError.unauthorized(message);
    case 403:
      throw ApiError.forbidden(message);
    case 404:
      throw ApiError.notFound(message);
    case 409:
      throw ApiError.conflict(message);
    case 422:
      throw ApiError.unprocessable(message, errors);
    case 429:
      throw ApiError.manyRequests(message);
    default:
      // преобраз.др.ошб.в клс.ApiError
      throw new ApiError(
        status,
        message,
        errors instanceof Error ? errors.message : String(errors),
      );
  }
};
