import AppError from "../error/ApiError";
import RatingService from "../services/rating.service";

class RatingController {
  async getOneRating(req, res, next) {
    try {
      const rating = await RatingService.getOneRating(req.params.productId);
      res.json(rating);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async createRating(req, res, next) {
    try {
      const { productId, rate } = req.params;
      const rating = await RatingService.createRating(
        rate,
        productId,
        req.auth.id
      );
      res.json(rating);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new RatingController();
