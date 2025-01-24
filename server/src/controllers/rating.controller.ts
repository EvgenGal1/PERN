import { NextFunction, Request, Response } from 'express';

import RatingService from '../services/rating.service';
import { parseId } from '../utils/validators';
import ApiError from '../middleware/errors/ApiError';

class RatingController {
  constructor() {
    this.getOneRating = this.getOneRating.bind(this);
    this.createRating = this.createRating.bind(this);
  }

  private readonly name = 'Товара';
  private readonly user = 'Пользователя';
  private readonly rating = 'Рейтинга';

  async getOneRating(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseId(req.params.productId, this.name);
      const rating = await RatingService.getOneRating(productId);
      res.status(200).json(rating);
    } catch (error: unknown) {
      next(error);
    }
  }

  async createRating(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth?.id) {
        throw ApiError.badRequest('ID пользователя не найден');
      }
      const rate = parseId(req.params.rate, this.rating);
      const productId = parseId(req.params.productId, this.name);
      const userId = req.auth.id; // const userId = parseId(req.auth.id, this.user);
      const rating = await RatingService.createRating(rate, productId, userId);
      res.status(201).json(rating);
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new RatingController();
