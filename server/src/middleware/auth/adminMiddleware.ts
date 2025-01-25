// ^ проверка Роли ADMIN для доп.прав

import { Request, Response, NextFunction } from 'express';

import { NameUserRoles } from '../../config/constants/roles';
import ApiError from '../errors/ApiError';

const adminMW = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.auth || req.auth?.role !== NameUserRoles.ADMIN) {
      throw ApiError.forbidden('Только для администратора');
    }
    next();
  } catch (error: unknown) {
    next(ApiError.forbidden((error as Error).message));
  }
};

export default adminMW;
