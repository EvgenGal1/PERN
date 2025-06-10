import { Request, Response, NextFunction } from 'express';

import ApiError from '../errors/ApiError';

const roleMW = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.auth?.roles[0];
    if (!userRole) {
      return next(ApiError.forbidden('Роль Пользователя не найдена'));
    }

    if (!requiredRoles.includes(userRole.role)) {
      return next(ApiError.forbidden(`Доступ для роли ${userRole} запрещен`));
    }

    next();
  };
};

export default roleMW;
