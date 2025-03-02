// табл.
import UserModel from '../models/UserModel';
import BasketModel from '../models/BasketModel';
import ProductModel from '../models/ProductModel';
import BasketProductModel from '../models/BasketProductModel';
// утилиты/helpы/
import DatabaseUtils from '../utils/database.utils';
// type/dto
import { BasketResponse, BasketWithProducts } from '../types/basket.interface';
// обраб.ошб.
import ApiError from '../middleware/errors/ApiError';

class BasketService {
  // получить корзину по basketId/userId
  async getOneBasket(
    basketId?: number,
    userId?: number,
  ): Promise<BasketResponse> {
    if (!basketId && !userId)
      throw ApiError.badRequest('Требуется basketId или userId');
    // получ.по basketId или userId
    const basket = await BasketModel.findOne({
      where: basketId ? { id: basketId } : { userId },
      attributes: ['id', 'userId'],
      include: [
        {
          model: ProductModel,
          as: 'products',
          attributes: ['id', 'name', 'price'], // поля Продукта
          through: { attributes: ['quantity'], as: 'BasketProduct' }, // вкл.кол-во из связ.табл.
        },
      ],
    });
    if (!basket || !basket.products)
      throw ApiError.notFound(
        `Корзина ${basketId ? `с ID '${basketId}' ` : `Пользователя с ID ${userId}`} не найдена`,
      );
    return DatabaseUtils.formatBasketResponse(basket as BasketWithProducts);
  }

  // созд.корзину по userId
  async createBasket(userId: number): Promise<BasketResponse> {
    // параллел.req >  получ. наименьший ID, user по ID
    const [user, smallestId] = await Promise.all([
      UserModel.findByPk(userId),
      DatabaseUtils.getSmallestIDAvailable('basket'),
    ]);
    if (!user)
      throw ApiError.notFound(`Пользователь с ID '${userId}' не найден`);

    const basket = await BasketModel.create({ id: smallestId, userId });
    return DatabaseUtils.formatBasketResponse(basket as BasketWithProducts);
  }

  // добавить Продукт в корзину
  async appendBasket(
    basketId: number,
    productId: number,
    quantity: number,
  ): Promise<BasketResponse> {
    // параллел.req > получ. Корзины и Продуктов по их ID
    const [basket, product] = await Promise.all([
      BasketModel.findByPk(basketId),
      ProductModel.findByPk(productId),
    ]);
    if (!basket) throw ApiError.notFound('Корзина не найдена');
    if (!product) throw ApiError.notFound('Продукт не найден');
    // обнов.кол-во или добав.нов.Продукт в Корзину
    const [item] = await BasketProductModel.findOrCreate({
      where: { basketId, productId },
      // созд.е/и отсутствует
      defaults: { basketId, productId, quantity },
    });
    // е/и Продукт стар. - увелич.кол-во Продуктов в Корзине
    if (!item.isNewRecord) {
      await item.increment('quantity', { by: quantity });
    }
    // нов.req > актуал.данн.
    return this.getOneBasket(basketId);
  }

  // добавить Продукт в Корзину
  async incrementBasket(
    basketId: number,
    productId: number,
    quantity: number,
  ): Promise<BasketResponse> {
    if (quantity <= 0)
      throw ApiError.badRequest('Количество должно быть больше 0');
    const item = await BasketProductModel.findOne({
      where: { basketId, productId },
    });
    if (!item) throw ApiError.notFound('Продукт не найден в Корзине');
    await item.increment('quantity', { by: quantity });
    return this.getOneBasket(basketId);
  }

  // убрать Продукт из Корзины
  async decrementBasket(
    basketId: number,
    productId: number,
    quantity: number,
  ): Promise<BasketResponse> {
    const item = await BasketProductModel.findOne({
      where: { basketId, productId },
    });
    if (!item) throw ApiError.notFound('Продукт не найден в Корзине');
    // сравнения кол-ва Продуктов (удал.Продукт е/и 0|< или уменьш.кол-ва Продукта)
    if (item.quantity <= quantity) {
      await item.destroy();
    } else {
      await item.decrement('quantity', { by: quantity });
    }
    return this.getOneBasket(basketId);
  }

  // удаление Продукта из Корзины
  async removeBasket(
    basketId: number,
    productId: number,
  ): Promise<BasketResponse> {
    const item = await BasketProductModel.findOne({
      where: { basketId, productId },
    });
    if (!item) throw ApiError.notFound('Продукт не найден в Корзине');
    // удал.Продукта
    await item.destroy();
    return this.getOneBasket(basketId);
  }

  // очистка Корзины от Продуктов
  async clearBasket(basketId: number): Promise<BasketResponse> {
    const basket = await BasketModel.findByPk(basketId);
    if (!basket) throw ApiError.notFound('Корзина не найдена');
    // удал.всех Продуктов Корзины
    await BasketProductModel.destroy({ where: { basketId } });
    return this.getOneBasket(basketId);
  }

  // удаление Корзины (с Продуктами как в removeBasket но без проверок)
  async deleteBasket(basketId: number): Promise<void | { message: string }> {
    const basket = await BasketModel.findByPk(basketId, {
      include: [BasketProductModel],
    });
    if (!basket)
      throw ApiError.notFound(`Корзина с ID '${basketId}' не найдена`);
    // удал., возврат смс
    const productCount = basket.products?.length ?? 0;
    // связь CASCADE удаляет и Продукты и Корзину
    await basket.destroy();
    return {
      message: `Корзина с ID '${basketId}' ${productCount ? `с ${productCount} Продуктами` : 'без Продуктов'} удалена`,
    };
  }
}

export default new BasketService();
