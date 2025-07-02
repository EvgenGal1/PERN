// ^ проверка Роли ADMIN для доп.прав

import { Request, Response, NextFunction } from 'express';

import { NameUserRoles } from '../../types/role.interface';
import ApiError from '../errors/ApiError';

const adminMW = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const isAdmin = req.auth?.roles?.some(
      (r) => r.role === NameUserRoles.ADMIN,
    );
    if (!req.auth || isAdmin) {
      throw ApiError.forbidden('Только для администратора');
    }
    next();
  } catch (error: unknown) {
    next(ApiError.forbidden((error as Error).message));
  }
};

export default adminMW;
