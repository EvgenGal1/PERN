import RatingModel from "../services/Rating.js";
import AppError from "../error/AppError_Tok.js";

class Rating {
  async getOne(req, res, next) {
    try {
      const rating = await RatingModel.getOne(req.params.productId);
      res.json(rating);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const { productId, rate } = req.params;
      // ! врем.откл.
      // const rating = await RatingModel.create(req.auth.userId, productId, rate);
      const rating = await RatingModel.create(3, productId, rate);
      res.json(rating);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Rating();
