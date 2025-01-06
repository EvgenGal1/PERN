// ^ глобал.обарб.ошб.Express с логг./стат.смс.

import { Request, Response, NextFunction } from 'express';

// клс.польз.ошб.
import AppError from './ApiError';
// логг.ошб.
import { LoggingWinston as logger } from '../../config/logging/log_winston.config';

const ErrorHandler = (
  err: AppError | Error,
  req: Request,
  res: any /* Response */,
  next: NextFunction,
) => {
  // ошб.экземпл.AppError
  if (err instanceof AppError) {
    logger.error(
      `API ОШБ.: ${req.method} ${req.url}: ${err.message} (${err.status})`,
    );
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      errors: err.errors || null,
    });
  }

  // обраб./лог./ответ неизвестной ошб.
  const message = err?.message || 'Произошла неизвестная ошибка';
  const stack = err?.stack || 'Трассировка стека недоступна';
  logger.error(`Неизвестная ошибка - ${req.method} ${req.url}: ${message}`, {
    stack,
  });
  return res.status(500).json({
    message: 'Непредвиденная ошибка',
    errors: /* err?.errors || */ null,
  });
};

export default ErrorHandler;
