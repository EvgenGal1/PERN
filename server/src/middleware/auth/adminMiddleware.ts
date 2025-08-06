// ^ проверка Роли ADMIN для доп.прав

import { Request, Response, NextFunction } from 'express';

import { ROLES_CONFIG } from '../../config/api/roles.config';
import ApiError from '../errors/ApiError';

const adminMW = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const isAdmin = req.auth?.roles?.some(
      (r: { role: string }) => r.role === ROLES_CONFIG.ADMIN.name,
    );
    if (!req.auth || isAdmin) {
      throw ApiError.forbidden('Только для Администратора');
    }
    next();
  } catch (error: unknown) {
    next(ApiError.forbidden((error as Error).message));
  }
};

export default adminMW;
