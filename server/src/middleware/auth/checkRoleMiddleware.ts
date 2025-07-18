// ^ middleware по добав.нов.устройство только > опред.ролей, +декодер,валид.

import { Request, Response, NextFunction } from 'express';

import TokenService from '../../services/token.service';
import ApiError from '../errors/ApiError';

// экспорт fn принимающая Роль (вызов fn с передачей Роли и возврат.middleware)
export default function roleMW(roles: string[]) {
  // возвращ. сам middleware
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (req.method === 'OPTIONS') return next(); // пропуск CORS req

    try {
      // проверка в header поля authorization
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw ApiError.unauthorized('Требуется авторизация для проверки');
      }
      // извлечь токен из header (отделить от Типа`Носитель` под ind 0)
      const tokenAccess = authorizationHeader.split(' ')[1]; // Bearer <токен>
      if (!tokenAccess) {
        throw ApiError.unauthorized('Токен отсутствует');
      }

      // проверка валидации
      const decoded = await TokenService.validateAccessToken(tokenAccess);
      if (!decoded || !decoded.id || !decoded.roles) {
        throw ApiError.unauthorized('Токен не валид');
      }

      // получ. Ролей Пользователя
      const userRoles = decoded.roles;
      if (!userRoles.length)
        throw ApiError.unauthorized('У Пользователя нет Ролей');
      // проверка разрешенных Ролей
      const hasRoles = userRoles.some((userRole) =>
        roles.includes(userRole.role),
      );
      if (!hasRoles) {
        throw ApiError.forbidden(
          `Нет доступа для одной из Ролей: ${userRoles.join(', ')}`,
        );
      }
      // cохр.декод.инфо.Пользователя в req
      req.body.user = decoded;
      next();
    } catch (error: unknown) {
      throw ApiError.forbidden((error as ApiError).message);
    }
  };
}
