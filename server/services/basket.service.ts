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
  async getOne(basketId: number) {
    let basket = await BasketMapping.findByPk(basketId, {
      attributes: ["id"],
      include: [{ model: ProductMapping, attributes: ["id", "name", "price"] }],
    });
    if (!basket) {
      basket = await BasketMapping.create();
    }
    // return basket;
    return pretty(basket);
  }

  async create() {
    const basket = await BasketMapping.create();
    // return basket;
    return pretty(basket);
  }

  async append(basketId: number, productId: number, quantity: number) {
    let basket = await BasketMapping.findByPk(basketId, {
      attributes: ["id"],
      include: [{ model: ProductMapping, attributes: ["id", "name", "price"] }],
    });
    if (!basket) {
      basket = await BasketMapping.create();
    }
    // проверяем, есть ли уже этот товар в корзине
    const basket_product = await BasketProductMapping.findOne({
      where: { basketId, productId },
    });
    if (basket_product) {
      // есть в корзине
      await basket_product.increment("quantity", { by: quantity });
    } else {
      // нет в корзине
      await BasketProductMapping.create({ basketId, productId, quantity });
    }
    // обновим объект корзины, чтобы вернуть свежие данные
    await basket.reload();
    // return basket;
    return pretty(basket);
  }

  async increment(basketId: number, productId: number, quantity: number) {
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
      await basket_product.increment("quantity", { by: quantity });
      // обновим объект корзины, чтобы вернуть свежие данные
      await basket.reload();
    }
    // return basket;
    return pretty(basket);
  }

  async decrement(basketId: number, productId: number, quantity: number) {
    let basket = await BasketMapping.findByPk(basketId, {
      include: [{ model: ProductMapping, as: "products" }],
    });
    if (!basket) {
      // ! ошб. - Свойство "create" не существует в типе "typeof Basket" // ^ ИИ советует заменить Basket > BasketMapping
      basket = await /* Basket */ BasketMapping.create();
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
    // return basket;
    return pretty(basket);
  }

  async remove(basketId: number, productId: number) {
    let basket = await BasketMapping.findByPk(basketId, {
      include: [{ model: ProductMapping, as: "products" }],
    });
    if (!basket) {
      basket = await /* Basket */ BasketMapping.create();
    }
    // проверяем, есть ли этот товар в корзине
    const basket_product = await BasketProductMapping.findOne({
      where: { basketId, productId },
    });
    if (basket_product) {
      await basket_product.destroy();
      // обновим объект корзины, чтобы вернуть свежие данные
      await basket.reload();
    }
    // return basket;
    return pretty(basket);
  }

  async clear(basketId: number) {
    let basket = await BasketMapping.findByPk(basketId, {
      include: [{ model: ProductMapping, as: "products" }],
    });
    if (basket) {
      await BasketProductMapping.destroy({ where: { basketId } });
      // обновим объект корзины, чтобы вернуть свежие данные
      await basket.reload();
    } else {
      basket = await /* Basket */ BasketMapping.create();
    }
    // return basket;
    return pretty(basket);
  }

  async delete(basketId: number) {
    const basket = await BasketMapping.findByPk(basketId, {
      include: [{ model: ProductMapping, as: "products" }],
    });
    if (!basket) {
      throw new Error("Корзина не найдена в БД");
    }
    await basket.destroy();
    // return basket;
    return pretty(basket);
  }
}

export default new Basket();
