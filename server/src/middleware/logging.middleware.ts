// ^ логирования входящих HTTP запросов

import { Request, Response, NextFunction } from 'express';

import { LoggingWinston as logger } from '../config/logging/log_winston.config';

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info(`Request: ${req.method} ${req.url} - ${req.ip}`);
  next();
}
