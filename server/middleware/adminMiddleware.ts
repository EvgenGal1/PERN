// ^ проверка Роли ADMIN для доп.прав
import { Request, Response, NextFunction } from 'express';

import AppError from '../error/ApiError';
import { DecodedToken } from '../types/DecodedToken';

interface CustomRequest extends Request {
  auth?: DecodedToken;
}

const admin = (req: CustomRequest, res: Response, next: NextFunction): void => {
  try {
    if (req.auth?.role !== 'ADMIN') {
      throw new Error('Только для администратора');
    }
    next();
  } catch (error: unknown) {
    next(AppError.forbidden((error as Error).message));
  }
};

export default admin;
