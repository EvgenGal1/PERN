// ^ глобал.обарб.ошб.Express с логг./стат.смс.

import { Request, NextFunction } from 'express';

// клс.польз.ошб.
import ApiError from './ApiError';
// логг.ошб.
import { LoggingWinston as logger } from '../../config/logging/log_winston.config';

const ErrorHandler = (
  err: ApiError | Error,
  req: Request,
  res: any /* Response */,
  next: NextFunction,
) => {
  // преобраз.неизвест.ошб.в формат ApiError
  if (!(err instanceof ApiError) && err instanceof Error) {
    err = ApiError.internal(err.message);
  }

  // ошб.экземпл.ApiError
  if (err instanceof ApiError) {
    logger.error(
      `API ОШБ.: ${req.method} ${req.url}: ${err.message} (${err.status})`,
    );
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      errors: err.errors || null,
    });
  }

  // неизвестые ошб. обраб./лог./ответ
  const message = JSON.stringify(err) || 'Произошла неизвестная ошибка';
  logger.error(`API ... ОШБ.: ${req.method} ${req.url}: ${err.message}`);
  return res.status(500).json({
    message: message,
    errors: null,
  });
};

export default ErrorHandler;
