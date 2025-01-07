import { NextFunction, Request, Response } from 'express';

import AppError from '../middleware/errors/ApiError';
import RatingService from '../services/rating.service';

class RatingController {
  async getOneRating(req: Request, res: Response, next: NextFunction) {
    try {
      const rating = await RatingService.getOneRating(+req.params.productId);
      res.json(rating);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async createRating(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth?.id) {
        return next(AppError.badRequest('ID пользователя не найден'));
      }
      const { productId, rate } = req.params;
      const rating = await RatingService.createRating(
        +rate,
        +productId,
        +req.auth.id,
      );
      res.json(rating);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
}

export default new RatingController();
