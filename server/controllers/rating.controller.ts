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
      // ! врем.откл.
      // const rating = await RatingService.create(req.auth.userId, productId, rate);
      const rating = await RatingService.create(3, productId, rate);
      res.json(rating);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Rating();
