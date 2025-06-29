// ^ подтвержд.личности ч/з JWT-токена полученый либо после регистрации, либо после входа в личный кабинет

import { Request, Response, NextFunction } from 'express';

import ApiError from '../errors/ApiError';
import { DecodedToken } from '../../types/DecodedToken';
import { AuthPayload } from '../../types/AuthPayload';
import TokenService from '../../services/token.service';

const authMW = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // е/и mtd OPTIONS то продолжаем (проверка GET,POST,и т.д.)
  if (req.method === 'OPTIONS') return next();

  try {
    // проверка header на наличие поля authorization
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      // ^ - throw. В MW express необход.использ. return - мгновен.заверщ., без лишнего перехода в catch, без выполн.след.кода
      return next(ApiError.unauthorized('Требуется Авторизация'));
    }

    // достать токен из header (отделяя от типа `Носитель` передающегося по ind 0)
    const tokenAccess = authorizationHeader?.split(' ')[1]; // Bearer token (asfasnfkajsfnjk)
    if (!tokenAccess) {
      return next(ApiError.forbidden('Токен отсутствует'));
    }

    // раскодир.токен. `проверять` валидации ч/з services (токен)
    const decoded = (await TokenService.validateAccessToken(
      tokenAccess,
    )) as DecodedToken;
    if (!decoded || !decoded.id || !decoded.roles) {
      return next(ApiError.unauthorized('Токен не валиден'));
    }

    // к req в auth добав.строг.тип.раскодир.данн и вызов след.middlware
    req.auth = decoded as AuthPayload;
    next();
  } catch (error: unknown) {
    // - throw. Перехват неизвестных ошб.
    next(error);
  }
};

export default authMW;
