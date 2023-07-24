import AppError from "../error/ApiError";
import { Rating as RatingMapping } from "../models/mapping";
import { Product as ProductMapping } from "../models/mapping";
import { User as UserMapping } from "../models/mapping";

class Rating {
  async getOne(productId: number) {
    // console.log("productId : " + productId);
    const product = await ProductMapping.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    // `голосов`
    const votes = await RatingMapping.count({ where: { productId } });
    if (votes) {
      // `ставки`
      const rates = await RatingMapping.sum("rate", { where: { productId } });
      return { rates, votes, rating: rates / votes };
    }
    // `ставки голоса рейтинг`
    return { rates: 0, votes: 0, rating: 0 };
  }

  async create(rate: number, productId: number, userId: number) {
    console.log("rate : " + rate);
    console.log("productId : " + productId);
    console.log("userId : " + userId);
    const product = await ProductMapping.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const user = await UserMapping.findByPk(userId);
    if (!user) {
      throw new Error("Пользователь не найден в БД");
    }
    console.log("1 : " + 1);
    // находим/удаляем данн.Рейтинга/Пользователя е/и он уже голосовал
    const ratingUserId = await RatingMapping.findOne({
      where: { userId: userId, productId: productId },
    });
    console.log("2 : " + 2);
    console.log("ratingUserId : " + ratingUserId);
    if (
      ratingUserId?.userId == userId &&
      ratingUserId?.productId == productId
    ) {
      await RatingMapping.destroy({
        where: { userId: userId, productId: productId },
      });
    }

    // созд.нов.Рейтинг
    const rating = await RatingMapping.create({
      rate: rate,
      productId: productId,
      userId: userId,
    });

    // запросы для вычисления средн.Рейтинга (ставки, голоса)
    const votes = await RatingMapping.count({ where: { productId } });
    const rates = await RatingMapping.sum("rate", { where: { productId } });
    const ratingAll = rates / votes;

    // перем./запрос для обнов.Товара
    let name = product.name;
    let price = product.price;
    let image = product.image;
    let categoryId = product.categoryId;
    let brandId = product.brandId;
    if (ratingAll) {
      await product.update({
        name: name,
        price: price,
        rating: ratingAll,
        image: image,
        categoryId: categoryId,
        brandId: brandId,
      });
    }

    // return rating;
    // return { ...rating, ratingAll };
    return { ...rating.dataValues, ratingAll, votes /* , rates */ };
  }
}

export default new Rating();
