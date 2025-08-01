// ^ подтвержд.личности ч/з JWT-токена полученый либо после регистрации, либо после входа в личный кабинет

import { Request, Response, NextFunction } from 'express';

import TokenService from '../../services/token.service';
import { TokenDto } from '../../types/auth.interface';
import ApiError from '../errors/ApiError';

const authMW = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // е/и mtd OPTIONS то продолжаем (проверка GET,POST,и т.д.)
  if (req.method === 'OPTIONS') return next();

  try {
    // проверка header на наличие поля authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // ^ в MW express необход.использ. return next() - мгновен.выход с передачей ошб.в ErrorHandler. (не throw(> синхр.), не next(продолж.выполн.))
      return next(
        ApiError.unauthorized('Требуется Авторизация (заголовок отсутствует)'),
      );
    }

    // достать токен из header (отделяя от типа `Носитель` передающегося по ind 0)
    const [bearer, tokenAccess] = authHeader?.split(' '); // Bearer | token (asfasnfkajsfnjk)
    if (bearer !== 'Bearer' || !tokenAccess) {
      return next(
        ApiError.forbidden('Неверный формат Токена (ожидается Bearer <token>)'),
      );
    }

    // раскодир.токен. `проверять` валидации ч/з services (токен)
    const decoded = await TokenService.validateAccessToken(tokenAccess);
    if (!decoded || !decoded.id || !decoded.roles) {
      return next(ApiError.unauthorized('Токен не валиден'));
    }

    // проверка на наличие Роли
    if (!Array.isArray(decoded.roles) || decoded.roles.length === 0) {
      throw ApiError.unauthorized('У Пользователя нет Ролей');
    }

    // к req в auth добав.строг.тип.раскодир.данн и вызов след.middlware
    req.auth = decoded as TokenDto;
    next();
  } catch (error: unknown) {
    // next(error);
    next(
      error instanceof ApiError
        ? error
        : ApiError.unauthorized('Ошибка проверки Токена'),
    );
  }
};

export default authMW;
