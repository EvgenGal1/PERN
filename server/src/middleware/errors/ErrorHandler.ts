// ^ глобал.обарб.ошб.Express с логг./стат.смс.

import { Request, Response, NextFunction } from 'express';

// клс.польз.ошб.
import ApiError from './ApiError';
// логг.ошб.
import { LoggingWinston as logger } from '../../config/logging/log_winston.config';

/**
 * Middleware для обработки ошибок API
 */
const ErrorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // преобраз.неизвест.ошб.в формат ApiError
  if (!(err instanceof ApiError) && err instanceof Error) {
    err = new ApiError(500, err.message || 'Неизвестная ОШБ.', err.name);
  }

  const apiError = err as ApiError;

  // лог.ошб.
  logger.error(
    `\nAPI Error: ${req.method} ${req.url} - ${apiError.status}\n` +
      `Message : ${apiError.message}  Code : ${apiError.code}\n` +
      `Error : ${apiError.errors}`,
  );

  // стандарт.res
  res.status(apiError.status).json({
    status: apiError.status,
    message: apiError.message,
    errors: apiError.errors || null,
    code: apiError.code || 'UNKNOWN_ERROR',
  });
};

export default ErrorHandler;
