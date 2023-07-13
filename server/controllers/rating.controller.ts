import AppError from "../error/ApiError";
import RatingService from "../services/rating.service";

class Rating {
  async getOne(req, res, next) {
    try {
      const rating = await RatingService.getOne(req.params.productId);
      res.json(rating);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const { productId, rate } = req.params;
      const rating = await RatingService.create(rate, productId, req.auth.id);
      res.json(rating);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Rating();
