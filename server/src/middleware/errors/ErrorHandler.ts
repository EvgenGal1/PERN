// ^ глобал.обарб.ошб.Express с логг./стат.смс.

import { Request, Response, NextFunction } from 'express';

// клс.польз.ошб.
import ApiError from './ApiError';
// логг.ошб.
import { LoggingWinston as logger } from '../../config/logging/log_winston.config';
import { isDevelopment } from '../../config/envs/env.consts';

/**
 * Middleware для обработки ошибок API
 */
const ErrorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // > отладки е/и ошб.нестандарт
  if (!process.env.MEGA_TEST && isDevelopment)
    console.error('[ERROR HANDLER] Ошибка:', err);

  // отраб.ошб.null/undefined
  if (!err) {
    res.status(500).json({
      status: 500,
      message: 'Неизвестная ошибка (null/undefined)',
      errors: 'UnknownError',
      code: 'UNKNOWN_ERROR',
    });
    return;
  }

  // перем.ошб.
  let apiError: ApiError;

  // обраб.ошб.с преобраз.ошб.в формат ApiError
  if (err instanceof ApiError) apiError = err;
  else if (err instanceof Error) {
    apiError = new ApiError(500, err.message, {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  } else {
    apiError = new ApiError(500, 'Неизвестная ошибка', String(err));
  }

  // формат.ошб. > JSON
  const formattedErrors: string | null = apiError.errors
    ? typeof apiError.errors === 'string'
      ? apiError.errors
      : JSON.stringify(apiError.errors, null, 2)
    : null;

  // лог.ошб.
  logger.error(
    `\nAPI Error: ${req.method} ${req.url} - ${apiError.status}\n` +
      `Message : ${apiError.message}  Code : ${apiError.code}\n` +
      `Error : ${formattedErrors}`,
  );

  // стандарт.res
  res.status(apiError.status).json({
    status: apiError.status,
    message: apiError.message,
    errors: formattedErrors || null,
    code: apiError.code || 'UNKNOWN_ERROR',
  });
};

export default ErrorHandler;
