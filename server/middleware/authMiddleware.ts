// ^ подтвержд.личности ч/з JWT-токена полученый либо после регистрации, либо после входа в личный кабинет
import { Request, Response, NextFunction } from 'express';

import AppError from '../error/ApiError';
import { DecodedToken /*, CustomRequest */ } from '../types/DecodedToken';
import TokenService from '../services/token.service';

interface CustomRequest extends Request {
  auth?: DecodedToken;
}

const auth = (req: CustomRequest, res: Response, next: NextFunction): void => {
  // е/и mtd OPTIONS то продолжаем (проверка GET,POST,и т.д.)
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    // провер header на наличие поля authorization
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(AppError.unauthorizedError('Требуется авторизация'));
    }

    // достаём токен из header (отделяя от типа `Носитель` передающегося по ind 0) из шапки(обычн.там токен)
    const accessToken = authorizationHeader?.split(' ')[1]; // Bearer token (asfasnfkajsfnjk)
    if (!accessToken) {
      return next(AppError.unauthorizedError('Токен  отсутствует'));
    }

    // раскодир.токен. `проверять` валидации ч/з services (токен)
    const decoded = TokenService.validateAccessToken(
      accessToken,
    ) as DecodedToken;
    if (!decoded) return next(AppError.forbidden('Токен не валиден'));

    // к запросу в поле user добав.раскодированые данн.
    req.auth = decoded;

    // вызов след.middlware
    next();
  } catch (error: unknown) {
    next(AppError.forbidden((error as Error).message));
  }
};

export default auth;
