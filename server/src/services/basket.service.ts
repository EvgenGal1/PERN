import { Transaction } from 'sequelize';

import sequelize from '../config/sequelize';
// табл.Модулей
import BasketModel from '../models/BasketModel';
import ProductModel from '../models/ProductModel';
import BasketProductModel from '../models/BasketProductModel';
// утилиты/helpы/
import DatabaseUtils from '../utils/database.utils';
// type/dto
import type {
  BasketResponse,
  BasketWithProducts,
} from '../types/basket.interface';
// обраб.ошб.
import ApiError from '../middleware/errors/ApiError';

class BasketService {
  // получить корзину по basketId/userId
  /**
   * получ. Корзину с Продуктами
   * @param basketId - ID Корзины (опционально)
   * @param userId - ID Пользователя (опционально)
   * @param transaction - Транзакция (опционально)
   * @returns данн. Корзины с Продуктами
   */
  async getOneBasket(
    basketId?: number,
    userId?: number,
    transaction?: Transaction,
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
      transaction,
    });
    if (!basket || !basket.products)
      throw ApiError.notFound(
        `Корзина ${basketId ? `с ID '${basketId}' ` : `Пользователя с ID ${userId}`} не найдена`,
      );

    return DatabaseUtils.formatBasketResponse(basket as BasketWithProducts);
  }

  // созд.корзину по userId
  /**
   * созд. Корзину для Пользователя
   * @param userId - ID Пользователя
   * @param transaction - Транзакция (опционально)
   * @returns данн. Корзины
   */
  async createBasket(
    userId: number,
    transaction?: Transaction,
  ): Promise<BasketResponse> {
    // получ. наименьший ID, созд.Корзину
    const smallestId = await DatabaseUtils.getSmallestIDAvailable(
      'basket',
      transaction,
    );

    const basket = await BasketModel.create(
      { id: smallestId, userId },
      { transaction },
    );
    return DatabaseUtils.formatBasketResponse(basket as BasketWithProducts);
  }

  /**
   * добав.или обнов. Продукт в Корзине
   * @param basketId - ID Корзины
   * @param productId - ID Продукта
   * @param quantity - Количество для добавления
   * @returns Обнов. Корзина
   */
  async appendBasket(
    basketId: number,
    productId: number,
    quantity: number,
  ): Promise<BasketResponse> {
    if (quantity <= 0) {
      throw ApiError.badRequest('Количество должно быть больше 0');
    }

    // нач.транзакции
    const transaction = await sequelize.transaction();

    try {
      // общ.req > получ. Корзины и Продуктов по их ID и проверка
      const [basket, product] = await Promise.all([
        BasketModel.findByPk(basketId),
        ProductModel.findByPk(productId),
      ]);
      if (!basket) throw ApiError.notFound('Корзина не найдена');
      if (!product) throw ApiError.notFound('Продукт не найден');

      // Обнов.Кол-во или Добав.нов. Продукт в Корзину
      const [basketProduct, created] = await BasketProductModel.findOrCreate({
        where: { basketId, productId },
        defaults: { basketId, productId, quantity },
        transaction,
      });
      // е/и Продукт стар.(created = false) - увелич.Кол-во Продуктов в Корзине
      if (!created) {
        await basketProduct.increment('quantity', {
          by: quantity,
          transaction,
        });
      }

      // нов.req > актуал.данн.
      const result = await this.getOneBasket(basketId, undefined, transaction);
      // подтвердить транзакцию
      await transaction.commit();
      return result;
    } catch (error) {
      // откат транзакции при ошб.
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * увелич.Кол-во Продуктов в Корзине
   * @param basketId - ID Корзины
   * @param productId - ID Продукта
   * @param quantity - Количество для добавления
   * @returns Обнов. Корзина
   */
  async incrementBasket(
    basketId: number,
    productId: number,
    quantity: number,
  ): Promise<BasketResponse> {
    if (quantity <= 0)
      throw ApiError.badRequest('Количество должно быть больше 0');
    const transaction = await sequelize.transaction();
    try {
      const basketProduct = await BasketProductModel.findOne({
        where: { basketId, productId },
        transaction,
      });
      if (!basketProduct)
        throw ApiError.notFound('Продукт не найден в Корзине');
      await basketProduct.increment('quantity', { by: quantity, transaction });
      const result = await this.getOneBasket(basketId, undefined, transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * уменьш.Кол-во Продуктов в Корзине
   * @param basketId - ID Корзины
   * @param productId - ID Продукта
   * @param quantity - Количество для добавления
   * @returns Обнов. Корзина
   */
  async decrementBasket(
    basketId: number,
    productId: number,
    quantity: number,
  ): Promise<BasketResponse> {
    const transaction = await sequelize.transaction();
    try {
      const item = await BasketProductModel.findOne({
        where: { basketId, productId },
        transaction,
      });
      if (!item) throw ApiError.notFound('Продукт не найден в Корзине');
      // сравнения кол-ва Продуктов (удал.Продукт е/и 0 или уменьш.кол-ва Продукта)
      if (item.quantity <= quantity) await item.destroy({ transaction });
      else await item.decrement('quantity', { by: quantity, transaction });

      const result = await this.getOneBasket(basketId, undefined, transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * удал. Продукт из Корзины
   * @param basketId - ID Корзины
   * @param productId - ID Продукта
   * @param transaction - Транзакция (опционально)
   * @returns Обнов. корзина
   */
  async removeBasketProduct(
    basketId: number,
    productId: number,
  ): Promise<BasketResponse> {
    const transaction = await sequelize.transaction();
    try {
      const deletedCount = await BasketProductModel.destroy({
        where: { basketId, productId },
        transaction,
      });

      if (deletedCount === 0) {
        throw ApiError.notFound('Продукт не найден в корзине');
      }

      const basket = await this.getOneBasket(basketId, undefined, transaction);
      await transaction.commit();
      return basket;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * очистка Корзины от Всех Продуктов
   * @param basketId - ID корзины
   * @param transaction - Транзакция (опционально)
   * @returns Очищенная корзина
   */
  async clearBasketProducts(
    basketId: number,
    // transaction?: Transaction,
  ): Promise<BasketResponse> {
    const basket = await BasketModel.findByPk(basketId);
    if (!basket) throw ApiError.notFound('Корзина не найдена');

    const transaction = await sequelize.transaction();

    try {
      await BasketProductModel.destroy({
        where: { basketId },
        transaction,
      });

      const basket = await this.getOneBasket(basketId, undefined, transaction);
      await transaction.commit();
      return basket;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * полн.удал. Корзины (с Продуктами как в removeBasket но без проверок)
   * @param basketId - ID Корзины
   * @returns смс об Удалении
   */
  async deleteBasket(basketId: number): Promise<void | { message: string }> {
    const transaction = await sequelize.transaction();

    try {
      const basket = await BasketModel.findByPk(basketId, {
        include: [{ model: ProductModel, as: 'products', attributes: ['id'] }],
        transaction,
      });

      if (!basket) {
        throw ApiError.notFound(`Корзина с ID ${basketId} не найдена`);
      }

      const productCount = basket.products?.length || 0;
      await basket.destroy({ transaction });
      await transaction.commit();

      return {
        message: `Корзина с ID ${basketId} ${productCount ? `с ${productCount} Продуктами` : 'без Продуктов'} Удалена`,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new BasketService();
