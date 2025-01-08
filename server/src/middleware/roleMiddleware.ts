import { Request, Response, NextFunction } from 'express';
import ApiError from '../middleware/errors/ApiError';

const roleMW = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.auth?.role;
    if (!userRole) {
      return next(ApiError.forbidden('Роль пользователя не найдена'));
    }

    if (!requiredRoles.includes(userRole)) {
      return next(ApiError.forbidden(`Доступ для роли ${userRole} запрещен`));
    }

    next();
  };
};

export default roleMW;
