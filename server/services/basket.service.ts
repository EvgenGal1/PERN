import AppError from "../error/ApiError";
import { Basket as BasketMapping } from "../models/mapping";
import { Product as ProductMapping } from "../models/mapping";
import { BasketProduct as BasketProductMapping } from "../models/mapping";

const pretty = (basket) => {
  const data: any = {};
  data.id = basket.id;
  data.products = [];
  if (basket.products) {
    data.products = basket.products.map((item) => {
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

class Basket {
  async getOneBasket(basketId: number | null, userId?: number) {
    try {
      // ! костыль 1.1. получ./созд. basket по userId, либо получ.по basketId с Товарами
      let returned: any = {};
      if (userId) {
        returned = await BasketMapping.findByPk(basketId, {
          where: { userId: userId },
        });

        if (!returned) returned = await BasketMapping.create();

        return returned;
      } else if (basketId) {
        returned = await BasketMapping.findByPk(basketId, {
          attributes: ["id"],
          include: [
            { model: ProductMapping, attributes: ["id", "name", "price"] },
          ],
        });
      }

      return pretty(returned);
    } catch (error) {
      return AppError.badRequest(`Корзина не получена`, error.message);
    }
  }

  async createBasket(userId?: any) {
    try {
      let returned: any = {};
      // при передаче userId созд. Корзину с привязкой к User (Регистр User)
      if (userId) returned = await BasketMapping.create({ userId: userId });
      else returned = await BasketMapping.create();

      return pretty(returned);
    } catch (error) {
      return AppError.badRequest(`Корзина не создана`, error.message);
    }
  }

  async appendBasket(basketId: number, productId: number, quantity: number) {
    try {
      let basket = await BasketMapping.findByPk(basketId, {
        attributes: ["id"],
        include: [
          { model: ProductMapping, attributes: ["id", "name", "price"] },
        ],
      });

      if (!basket) basket = await BasketMapping.create();

      // проверяем, есть ли уже этот товар в корзине
      const basket_product = await BasketProductMapping.findOne({
        where: { basketId, productId },
      });

      // есть в корзине
      if (basket_product)
        await basket_product.increment("quantity", { by: quantity });
      // нет в корзине
      else await BasketProductMapping.create({ basketId, productId, quantity });

      // обновим объект корзины, чтобы вернуть свежие данные
      await basket.reload();

      return pretty(basket);
    } catch (error) {
      return AppError.badRequest(`В Корзину не добавлено`, error.message);
    }
  }

  async incrementBasket(basketId: number, productId: number, quantity: number) {
    try {
      let basket = await BasketMapping.findByPk(basketId, {
        include: [{ model: ProductMapping, as: "products" }],
      });

      if (!basket) basket = await BasketMapping.create();

      // проверяем, есть ли этот товар в корзине
      const basket_product = await BasketProductMapping.findOne({
        where: { basketId, productId },
      });

      if (basket_product) {
        await basket_product.increment("quantity", { by: quantity });
        // обновим объект корзины, чтобы вернуть свежие данные
        await basket.reload();
      }

      return pretty(basket);
    } catch (error) {
      return AppError.badRequest(`В Коризину не прибавлено`, error.message);
    }
  }

  async decrementBasket(basketId: number, productId: number, quantity: number) {
    try {
      let basket = await BasketMapping.findByPk(basketId, {
        include: [{ model: ProductMapping, as: "products" }],
      });

      if (!basket) {
        basket = await BasketMapping.create();
      }

      // проверяем, есть ли этот товар в корзине
      const basket_product = await BasketProductMapping.findOne({
        where: { basketId, productId },
      });

      if (basket_product) {
        if (basket_product.quantity > quantity) {
          await basket_product.decrement("quantity", { by: quantity });
        } else {
          await basket_product.destroy();
        }

        // обновим объект корзины, чтобы вернуть свежие данные
        await basket.reload();
      }

      return pretty(basket);
    } catch (error) {
      return AppError.badRequest(`Из Коризины не убавлено`, error.message);
    }
  }

  async clearBasket(basketId: number) {
    try {
      let basket = await BasketMapping.findByPk(basketId, {
        include: [{ model: ProductMapping, as: "products" }],
      });

      if (basket) {
        await BasketProductMapping.destroy({ where: { basketId } });
        await basket.reload();
      } else {
        basket = await BasketMapping.create();
      }

      return pretty(basket);
    } catch (error) {
      return AppError.badRequest(`Коризина не jxbotyf`, error.message);
    }
  }

  // удаление Корзины
  async deleteBasket(basketId: number) {
    try {
      const basket = await BasketMapping.findByPk(basketId, {
        include: [{ model: ProductMapping, as: "products" }],
      });
      if (!basket) throw new Error("Корзина не найдена в БД");

      if (basketId == basket.userId) {
        BasketMapping.destroy({ where: { userId: basketId } });
      } else {
        await basket.destroy();
      }

      return pretty(basket);
    } catch (error) {
      return AppError.badRequest(`Коризина не удалена`, error.message);
    }
  }

  // удаление Корзины с Товарами
  async removeBasket(basketId: number, productId: number) {
    try {
      let basket = await BasketMapping.findByPk(basketId, {
        include: [{ model: ProductMapping, as: "products" }],
      });
      if (!basket) throw new Error("Корзина не найдена в БД");

      if (!basket) basket = await BasketMapping.create();

      // проверяем, есть ли этот товар в корзине
      const basket_product = await BasketProductMapping.findOne({
        where: { basketId, productId },
      });

      if (basket_product) {
        await basket_product.destroy();
        await basket.reload();
      }

      return pretty(basket);
    } catch (error) {
      return AppError.badRequest(
        `Коризина с Товарами не удалена`,
        error.message
      );
    }
  }
}

export default new Basket();
