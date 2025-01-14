// табл.
import BasketModel from '../models/BasketModel';
import ProductModel from '../models/ProductModel';
import BasketProductModel from '../models/BasketProductModel';
// утилиты/helpы/ошб.
import DatabaseUtils from '../utils/database.utils';
import ApiError from '../middleware/errors/ApiError';
import { BasketResponse } from '../types/basket.interface';
import UserModel from '../models/UserModel';

class BasketService {
  // получить корзину по basketId или userId
  async getOneBasket(
    basketId: number | null,
    userId?: number,
  ): Promise<BasketResponse> {
    if (!basketId && !userId)
      throw ApiError.badRequest('Не переданы basketId или userId');
    // получ.по basketId или userId
    const basket = await BasketModel.findOne({
      where: basketId ? { id: basketId } : { userId },
      include: [
        {
          model: ProductModel,
          as: 'products',
          attributes: ['id', 'name', 'price'],
        },
      ],
    });
    if (!basket) {
      throw ApiError.notFound(
        `Корзина ${basketId ? `basketId: '${basketId}'` : `userId: '${userId}'`} не найдена`,
      );
    }
    return await DatabaseUtils.formatBasketResponse(basket as any);
  }

  // созд.корзину по userId
  async createBasket(userId?: number): Promise<BasketResponse> {
    if (!userId) throw ApiError.badRequest(`Нет userId для создания корзины`);
    const user = await UserModel.findByPk(userId);
    if (!user) throw ApiError.notFound('Пользователь не найден');
    // `получить наименьший доступный идентификатор` из табл.БД
    const smallestFreeId = await DatabaseUtils.getSmallestIDAvailable('basket');
    const basket = await BasketModel.create({
      id: smallestFreeId,
      userId: userId,
    });
    if (!basket) throw ApiError.internal(`Ошибка при создании корзины`);
    return await DatabaseUtils.formatBasketResponse(basket);
  }

  // добавить товар в корзину
  async appendBasket(
    basketId: number,
    productId: number,
    quantity: number,
  ): Promise<BasketResponse> {
    // Корзина с Товарами
    const basket: any = await BasketModel.findByPk(basketId, {
      include: [
        {
          model: ProductModel,
          as: 'products',
          through: { attributes: ['quantity'] }, // вкл.кол-во из связ.табл.
          attributes: ['id', 'name', 'price'], // поля продукта
        },
      ],
    });
    if (!basket) throw ApiError.notFound('Корзина не найдена');
    // обнов.кол-во или добав.нов.Товар в Корзину
    const [basketProduct, created] = await BasketProductModel.findOrCreate({
      where: { basketId, productId },
      defaults: { basketId, productId, quantity }, // созд.е/и отсутствует
    });
    // е/и Товар не нов.созд. - увелич.кол-во в Корзине
    if (!created) {
      await basketProduct.increment('quantity', { by: quantity });
    }
    // обнов.объ.корзины, вкл.связ.продукты
    await basket.reload({
      include: [
        {
          model: ProductModel,
          as: 'products',
          through: { attributes: ['quantity'] }, // вкл.обнов.кол-во из связ.табл.
          attributes: ['id', 'name', 'price'], // поля продукта
        },
      ],
    });
    // формир./возвращ.ответ
    return await DatabaseUtils.formatBasketResponse(basket);
  }

  // увелич.кол-во Товаров в Корзине
  async incrementBasket(
    basketId: number,
    productId: number,
    quantity: number,
  ): Promise<BasketResponse> {
    if (quantity <= 0)
      throw ApiError.badRequest('Количество должно быть больше 0');
    const basketProduct = await BasketProductModel.findOne({
      where: { basketId, productId },
    });
    if (!basketProduct) throw ApiError.notFound('Товар не найден в корзине');
    await basketProduct.increment('quantity', { by: quantity });
    return this.getOneBasket(basketId);
  }

  // уменьш.кол-во Товаров в Корзине
  async decrementBasket(
    basketId: number,
    productId: number,
    quantity: number,
  ): Promise<BasketResponse> {
    const basketProduct = await BasketProductModel.findOne({
      where: { basketId, productId },
    });
    if (!basketProduct) throw ApiError.notFound('Товар не найден в корзине');
    // сравнения кол-ва Товаров
    if (basketProduct.quantity <= quantity) {
      await basketProduct.destroy(); // удал.Товар е/и 0|<
    } else {
      await basketProduct.decrement('quantity', { by: quantity }); // уменьш.Товар
    }
    return this.getOneBasket(basketId);
  }

  // очистка Корзины от Товаров
  async clearBasket(basketId: number): Promise<BasketResponse> {
    const basket = await BasketModel.findByPk(basketId);
    if (!basket) {
      throw ApiError.notFound(`Корзина с ID '${basketId}' не найдена`);
    }
    // удал.всех Товаров Корзины
    try {
      await BasketProductModel.destroy({ where: { basketId } });
    } catch (error) {
      throw ApiError.internal('Ошибка при удалении товаров из корзины');
    }
    return this.getOneBasket(basketId);
  }

  // удаление Корзины с Товарами
  async removeBasket(
    basketId: number,
    // productId: number,
  ): Promise</* BasketResponse | */ { message: string }> {
    const basket = await BasketModel.findByPk(basketId, {
      include: [{ model: BasketProductModel, as: 'products' }],
    });
    if (!basket)
      throw ApiError.notFound(`Корзина с ID '${basketId}' не найдена`);
    // удал.пуст.Корзину
    if (!basket.products || basket.products.length === 0) {
      // throw ApiError.badRequest('Корзина пуста, Товаров нет');
      await basket.destroy();
      return {
        message: `Корзина с ID '${basket.id}' удалена, Товаров не было`,
      };
    }
    // удал.Корзину с Товарами
    await basket.destroy(); // связь CASCADE удаляет и Товары и Корзину
    return { message: `Корзина с ID '${basket.id}' удалена` };
  }

  // удаление Корзины (с Товарами как в removeBasket но без проверок)
  async deleteBasket(
    basketId: number,
  ): Promise<void | { message: string } /* BasketResponse */> {
    const basket = await BasketModel.findByPk(basketId);
    if (!basket)
      throw ApiError.notFound(`Корзина с ID '${basketId}' не найдена`);
    await basket.destroy(); // связь CASCADE удаляет и Товары и Корзину
    return { message: `Корзина с ID '${basket.id}' удалена` };
  }
}

export default new BasketService();
