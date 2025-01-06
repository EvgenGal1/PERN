// табл.
import { BasketModel } from '../models/model';
import { ProductModel } from '../models/model';
import { BasketProductModel } from '../models/model';
// утилиты/helpы/ошб.
import DatabaseUtils from '../utils/database.utils';
import AppError from '../middleware/errors/ApiError';

const pretty = (basket: any) => {
  const data: any = {};
  data.id = basket.id;
  data.products = [];
  if (basket.products) {
    data.products = basket.products.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.basket_product.quantity,
      };
    });
  }
  return data;
};

class BasketService {
  async getOneBasket(basketId: number | null, userId?: number) {
    try {
      // получ.basket_id
      if (basketId == null && userId) {
        const idBasket = (await BasketModel.findOne({
          where: { userId: userId },
        })) as unknown as typeof BasketModel;
        if (idBasket) {
          return (idBasket as any).id;
        } else {
          throw AppError.badRequest('Корзина не найдена', 'idBasket is null');
        }
      }

      // получ. basket с product
      if (basketId === null) {
        throw AppError.badRequest('Корзина не найдена', 'basketId is null');
      }
      const basketProd = await BasketModel.findByPk(basketId, {
        attributes: ['id'],
        include: [{ model: ProductModel, attributes: ['id', 'name', 'price'] }],
      });

      return pretty(basketProd);
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Корзина не получена`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async createBasket(userId?: any) {
    try {
      // `получить наименьший доступный идентификатор` из табл.БД
      const smallestFreeId =
        await DatabaseUtils.getSmallestIDAvailable('basket');
      let returned: any = {};
      // при передаче userId созд. Корзину с привязкой к User (Регистр User)
      if (userId) {
        returned = await BasketModel.create({
          id: smallestFreeId,
          userId: userId,
        });
      } else {
        throw AppError.badRequest(
          `для Корзины не передан userId`,
          'НЕТ userId',
        );
        // ! прописать для всех createBasket передачу/подтягивание user_id убрав лишн.код с if/else
        returned = await BasketModel.create({
          id: smallestFreeId,
          userId: userId,
        });
      }

      return pretty(returned);
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Корзина не создана`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async appendBasket(basketId: number, productId: number, quantity: number) {
    try {
      let basket = await BasketModel.findByPk(basketId, {
        attributes: ['id'],
        include: [{ model: ProductModel, attributes: ['id', 'name', 'price'] }],
      });

      if (!basket) basket = await BasketModel.create();

      // проверяем, есть ли уже этот товар в корзине
      const basket_product = await BasketProductModel.findOne({
        where: { basketId, productId },
      });

      // есть в корзине
      if (basket_product)
        await basket_product.increment('quantity', { by: quantity });
      // нет в корзине
      else await BasketProductModel.create({ basketId, productId, quantity });

      // обновим объект корзины, чтобы вернуть свежие данные
      await basket.reload();

      return pretty(basket);
    } catch (error: unknown) {
      throw AppError.badRequest(
        `В Корзину не добавлено`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async incrementBasket(basketId: number, productId: number, quantity: number) {
    try {
      let basket = await BasketModel.findByPk(basketId, {
        include: [{ model: ProductModel, as: 'products' }],
      });
      if (!basket) basket = await BasketModel.create();

      // проверяем, есть ли этот товар в корзине
      const basket_product = await BasketProductModel.findOne({
        where: { basketId, productId },
      });

      if (basket_product && (basket_product as any).quantity > quantity) {
        await basket_product.increment('quantity', { by: quantity });
        // обновим объект корзины, чтобы вернуть свежие данные
        await basket.reload();
      }

      return pretty(basket);
    } catch (error: unknown) {
      throw AppError.badRequest(
        `В Коризину не прибавлено`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async decrementBasket(basketId: number, productId: number, quantity: number) {
    try {
      let basket = await BasketModel.findByPk(basketId, {
        include: [{ model: ProductModel, as: 'products' }],
      });

      if (!basket) {
        basket = await BasketModel.create();
      }

      // проверяем, есть ли этот товар в корзине
      const basket_product = await BasketProductModel.findOne({
        where: { basketId, productId },
      });

      if (basket_product) {
        if ((basket_product as any).quantity > quantity) {
          await basket_product.decrement('quantity', { by: quantity });
        } else {
          await basket_product.destroy();
        }

        // обновим объект корзины, чтобы вернуть свежие данные
        await basket.reload();
      }

      return pretty(basket);
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Из Коризины не убавлено`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async clearBasket(basketId: number) {
    try {
      let basket = await BasketModel.findByPk(basketId, {
        include: [{ model: ProductModel, as: 'products' }],
      });

      if (basket) {
        await BasketProductModel.destroy({ where: { basketId } });
        await basket.reload();
      } else {
        basket = await BasketModel.create();
      }

      return pretty(basket);
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Коризина не очищена`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  // удаление Корзины
  async deleteBasket(basketId: number) {
    try {
      const basket = await BasketModel.findByPk(basketId, {
        include: [{ model: ProductModel, as: 'products' }],
      });
      if (!basket) throw new Error('Корзина не найдена в БД');

      if (basketId == (basket as any).userId) {
        BasketModel.destroy({ where: { userId: basketId } });
      } else {
        await basket.destroy();
      }

      return pretty(basket);
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Коризина не удалена`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  // удаление Корзины с Товарами
  async removeBasket(basketId: number, productId: number) {
    try {
      let basket = await BasketModel.findByPk(basketId, {
        include: [{ model: ProductModel, as: 'products' }],
      });
      if (!basket) throw new Error('Корзина не найдена в БД');

      if (!basket) basket = await BasketModel.create();

      // проверяем, есть ли этот товар в корзине
      const basket_product = await BasketProductModel.findOne({
        where: { basketId, productId },
      });

      if (basket_product) {
        await basket_product.destroy();
        await basket.reload();
      }

      return pretty(basket);
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Коризина с Товарами не удалена`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
}

export default new BasketService();
