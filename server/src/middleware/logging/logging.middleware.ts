// ^ логирования входящих HTTP запросов

import { Request, Response, NextFunction } from 'express';

import { logger } from '../../config/logging/log_winston.config';
import { isDevelopment } from '../../config/envs/env.consts';

// масс.игнор. путь/url (содерж.часть/регуляр.выраж.>нач.стр.)
// const ignoredPathsRegex = [/^\/swagger/, /^\/favicon/, /^\/img\/ico/];
const ignoredPaths = ['/swagger', '/favicon.ico', '/img/ico/icon.ico'];

// MW логирования входящих HTTP-Запросов
export function requestLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // старт.вр.нач.req
  const startTime = Date.now();
  // лог.в DEV и вход.HTTP req не игнор
  // if (isDevelopment && !ignoredPathsRegex.some((regex) => regex.test(req.url)))
  if (
    isDevelopment &&
    !ignoredPaths.some((path) => req.originalUrl.startsWith(path))
  ) {
    // перем.req основ.вход.данн./объ.данн.req
    const HTTP_REQ = `${req.method} \x1b[33m${req.originalUrl}\x1b[0m ^{${req.ip}}`;
    const requestData: Record<string, any> = {};
    // добав.полей со значениями е/и есть
    if (req.headers['authorization']) {
      requestData.headers = {
        authorization: `${req.headers['authorization']}`
          ? `${req.headers['authorization']?.split(' ')[0]} ${req.headers['authorization']?.split(' ')[1].slice(0, 4)}...${req.headers['authorization']?.split(' ')[1].slice(-4)}`
          : undefined,
      };
    }
    if (req.params && Object.keys(req.params).length > 0) {
      requestData.params = req.params;
    }
    if (req.query && Object.keys(req.query).length > 0) {
      requestData.query = req.query;
    }
    if (req.body && Object.keys(req.body).length > 0) {
      requestData.body = {
        email: req.body.email
          ? // скрыть данн.
            `${req.body.email.slice(0, 4)}...${req.body.email.slice(-4)}`
          : undefined,
        password: req.body.password
          ? // скрыть данн.
            `${req.body.password.slice(0, 1)}...${req.body.password.slice(-1)}`
          : undefined,
      };
      // удал. email/password е/и нет
      if (!requestData.body.email) delete requestData.body.email;
      if (!requestData.body.password) delete requestData.body.password;
      // удал. body е/и пуст
      if (Object.keys(requestData.body).length === 0) delete requestData.body;
    }
    if (req.cookies.tokenRefresh) {
      requestData.cookies = {
        tokenRefresh: `${req.cookies.tokenRefresh.slice(0, 3)}...${req.cookies.tokenRefresh.slice(-3)}`,
      };
    }
    if (req.signedCookies.basketId || req.signedCookies.tokenRefresh) {
      requestData.signedCookies = {
        basketId: req.signedCookies.basketId,
        tokenRefresh: req.signedCookies.tokenRefresh
          ? // скрыть данн.
            `${req.signedCookies.tokenRefresh.slice(0, 3)}...${req.signedCookies.tokenRefresh.slice(-3)}`
          : undefined,
      };
      // удал. tokenRefresh е/и нет
      if (!requestData.signedCookies.tokenRefresh)
        delete requestData.signedCookies.tokenRefresh;
    }
    // лог.req
    logger.debug(
      `\x1b[42mВходящий запрос\x1b[0m: ${HTTP_REQ}${Object.keys(requestData).length > 0 ? ` ${JSON.stringify(requestData)}` : ''}`,
    );
    // перехват res > лог.вр.выполн.req (перенесено в responseLoggingMiddleware)
    // res.on('finish', () => {
    //   const duration = Date.now() - startTime;
    //   logger.debug(`ИсходящиЙ ОтвеТ: ${req.method} ${req.originalUrl} ~[${res.statusCode}] (${duration} мс)`);
    // });
    // передача вр.нач.req в res > подсчёта
    res.locals.startTime = startTime;
  }
  next();
}

// MW логирования исходящих HTTP-Ответов
export function responseLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // лог.в DEV и вход.HTTP req не игнор
  if (
    isDevelopment &&
    !ignoredPaths.some((path) => req.originalUrl.startsWith(path))
  ) {
    // сохр.мтд.отправки
    const originalSend = res.send;
    // const originalJson = res.json;
    // const originalEnd = res.end;
    // const originalStatus = res.status;
    // переопред.мтд. res.send > перехвата тела ответа
    res.send = function (body) {
      // вр.нач.req/вр.выполн.res
      const startTime = res.locals.startTime || Date.now();
      const duration = Date.now() - startTime;
      // перем.res основ.ответ.данн./объ.данн.res
      const HTTP_RES = `${req.method} \x1b[33m${req.originalUrl}\x1b[0m ~[${res.statusCode}] (${duration} мс)`;
      const responseData: Record<string, any> = {};
      // формир.тело res е/и есть
      if (body) {
        try {
          // парсить или тело
          const responseBody =
            typeof body === 'string' ? JSON.parse(body) : body;
          // скрыть данн.
          if (responseBody.data?.tokenAccess) {
            responseBody.data.tokenAccess = `${responseBody.data.tokenAccess.slice(0, 3)}...${responseBody.data.tokenAccess.slice(-3)}`;
          }
          // добав.res.тело в объ.данн.
          responseData.body = responseBody;
        } catch (error) {
          // лог.body напрямую е/и не JSON
          responseData.body = body;
        }
      }
      // лог.res
      logger.debug(
        `\x1b[45mИсходящий ответ\x1b[0m: ${HTTP_RES}${responseData.body ? ` ${JSON.stringify(responseData /*,null,2*/)}` : ''}`,
      );
      // отправка res ч/з вызов res.send
      return originalSend.call(this, body);
    };
  }
  next();
}
