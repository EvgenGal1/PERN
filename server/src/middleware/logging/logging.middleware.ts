// ^ логирования входящих HTTP запросов

import { Request, Response, NextFunction } from 'express';

import { LoggingWinston as logger } from '../../config/logging/log_winston.config';
import { isDevelopment } from '../../config/envs/env.consts';

// url игнор (нач./полн.)
// const ignoredPathsRegex = [/^\/swagger/, /^\/favicon/, /^\/img\/ico/];
const ignoredPaths = ['/swagger', '/favicon.ico', '/img/ico/icon.ico'];

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // лог.вход.HTTP req с исключениями
  // if (isDevelopment && !ignoredPathsRegex.some((regex) => regex.test(req.url)))
  if (isDevelopment && !ignoredPaths.some((path) => req.url.startsWith(path)))
    logger.debug(`HTTP REQ: ${req.method} ${req.url} - ${req.ip}`);
  next();
}
