import { NextFunction } from 'express';

import AppError from '../middleware/errors/ApiError';
import RatingService from '../services/rating.service';

class RatingController {
  async getOneRating(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
    try {
      const rating = await RatingService.getOneRating(req.params.productId);
      res.json(rating);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async createRating(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
    try {
      const { productId, rate } = req.params;
      const rating = await RatingService.createRating(
        rate,
        productId,
        req.auth.id,
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
