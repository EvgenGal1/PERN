import { ProductAttributes } from '../models/sequelize-types';
import RatingModel from '../models/RatingModel';
import ProductModel from '../models/ProductModel';
import UserModel from '../models/UserModel';
import ApiError from '../middleware/errors/ApiError';

class RatingService {
  async getOneRating(productId: number) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw ApiError.notFound('Продукт не найден');
    }
    // `голосов`
    const votes = await RatingModel.count({ where: { productId } });
    if (votes) {
      // `ставки`
      const rates = await RatingModel.sum('rate', { where: { productId } });
      return { rates, votes, rating: rates / votes };
    }
    // `ставки голоса рейтинг`
    return { rates: 0, votes: 0, rating: 0 };
  }

  async createRating(rate: number, productId: number, userId: number) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw ApiError.notFound('Продукт не найден');
    }
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw ApiError.notFound('Пользователь не найден');
    }

    // находим/удаляем данн.Рейтинга/Пользователя е/и он уже голосовал
    const ratingUserId = await RatingModel.findOne({
      where: { userId: userId, productId: productId },
    });

    if (
      ratingUserId?.get('userId') == userId &&
      ratingUserId?.get('productId') == productId
    ) {
      await RatingModel.destroy({
        where: { userId: userId, productId: productId },
      });
    }

    // созд.нов.Рейтинг
    const rating = await RatingModel.create({
      rate: rate,
      productId: productId,
      userId: userId,
    });

    // запросы для вычисления средн.Рейтинга (ставки, голоса)
    const votes = await RatingModel.count({ where: { productId } });
    const rates = await RatingModel.sum('rate', { where: { productId } });
    const ratings = rates / votes;

    // перем./запрос для обнов.Продукта
    const { name, price, image, categoryId, brandId } =
      product.get() as ProductAttributes;
    if (ratings) {
      await product.update({
        name: name,
        price: price,
        rating: ratings,
        image: image,
        categoryId: categoryId,
        brandId: brandId,
      });
    }

    return { ...rating.dataValues, ratings, votes /* , rates */ };
  }
}

export default new RatingService();
