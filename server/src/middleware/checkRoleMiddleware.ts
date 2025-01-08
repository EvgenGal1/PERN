// ^ middleware по добав.нов.устройство только > опред.ролей, +декодер,валид.

import { Request, Response, NextFunction } from 'express';

import TokenService from '../services/token.service';
import ApiError from '../middleware/errors/ApiError';

// экспорт fn принимающая Роль (вызов fn с передачей Роли и возврат.middleware)
export default function (role: string[]) {
  // возвращ. сам middleware
  return (req: any /* Request */, res: Response, next: NextFunction): void => {
    if (req.method === 'OPTIONS') next();

    try {
      // провер header на наличие поля authorization
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw ApiError.unauthorized('Требуется Авторизация');
      }
      // достаём токен из header (отделяя от Типа`Носитель` передающ по ind 0) из шапки(обычн.там токен)
      const accessToken = authorizationHeader.split(' ')[1]; // Bearer asfasnfkajsfnjk..
      if (!accessToken) {
        throw ApiError.unauthorized('Токен отсутствует');
      }

      // проверка валидации
      const decoded = TokenService.validateAccessToken(accessToken);
      if (!decoded || !decoded.id || !decoded.role) {
        throw ApiError.unauthorized('Токен не валид');
      }

      // раскодир.токен.`проверять`на валидность. const опред.с др.именем т.к. role уже есть. получ.масс.Ролей
      const { role: userRoles } = decoded;
      if (!userRoles) throw ApiError.unauthorized('НЕТ РОЛИ');

      // проверка масс.польз.Ролей с масс.разреш.Ролей для этой fn
      // перем.для определения
      let hasRoles = false;
      // итерац.по Ролям.польз.
      [userRoles].forEach((uRol) => {
        // е/и масс.разреш.Ролей содерж Роль польз.
        if (role.includes(uRol)) {
          // перем.в true
          hasRoles = true;
        }
      });
      if (!hasRoles) {
        throw ApiError.badRequest(
          `Нет доступа у Роли ${decoded.role} или ошб.Ролей`,
        );
      }

      req.user = decoded;
      next();
    } catch (error: unknown) {
      throw ApiError.forbidden((error as ApiError).message);
    }
  };
}
