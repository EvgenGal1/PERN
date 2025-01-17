// ^ подтвержд.личности ч/з JWT-токена полученый либо после регистрации, либо после входа в личный кабинет

import { Request, Response, NextFunction } from 'express';

import ApiError from '../errors/ApiError';
import { DecodedToken } from '../../types/DecodedToken';
import { AuthPayload } from '../../types/AuthPayload';
import TokenService from '../../services/token.service';

const authMW = (req: Request, res: Response, next: NextFunction): void => {
  // е/и mtd OPTIONS то продолжаем (проверка GET,POST,и т.д.)
  if (req.method === 'OPTIONS') next();

  try {
    // провер header на наличие поля authorization
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw ApiError.unauthorized('Требуется Авторизация');
    }

    // достать токен из header (отделяя от типа `Носитель` передающегося по ind 0)
    const accessToken = authorizationHeader?.split(' ')[1]; // Bearer token (asfasnfkajsfnjk)
    if (!accessToken) {
      throw ApiError.unauthorized('Токен отсутствует');
    }

    // раскодир.токен. `проверять` валидации ч/з services (токен)
    const decoded = TokenService.validateAccessToken(
      accessToken,
    ) as DecodedToken;
    if (!decoded || !decoded.id || !decoded.role) {
      throw ApiError.forbidden('Токен не валиден');
    }

    // к req в auth добав.строг.тип.раскодир.данн и вызов след.middlware
    req.auth = decoded as AuthPayload;
    next();
  } catch (error: unknown) {
    throw ApiError.forbidden((error as Error).message);
  }
};

export default authMW;
