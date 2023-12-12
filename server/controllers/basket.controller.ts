import AppError from "../error/ApiError";
import BasketService from "../services/basket.service";

const maxAge = 60 * 60 * 1000 * 24 * 365; // один год
const signed = true;

class BasketController {
  async appendBasket(req, res, next) {
    try {
      let basketId: number;

      if (!req.signedCookies.basketId) {
        let created = await BasketService.createBasket();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const { productId, quantity } = req.params;
      const basket = await BasketService.appendBasket(
        basketId,
        productId,
        quantity
      );
      res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOneBasket(req, res, next) {
    try {
      let basket;
      if (req.signedCookies.basketId) {
        basket = await BasketService.getOneBasket(
          parseInt(req.signedCookies.basketId)
        );
      } else {
        basket = await BasketService.createBasket();
      }
      res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async incrementBasket(req, res, next) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketService.createBasket();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const { productId, quantity } = req.params;
      const basket = await BasketService.incrementBasket(
        basketId,
        productId,
        quantity
      );
      res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async decrementBasket(req, res, next) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketService.createBasket();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const { productId, quantity } = req.params;
      const basket = await BasketService.decrementBasket(
        basketId,
        productId,
        quantity
      );
      res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async clearBasket(req, res, next) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketService.createBasket();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const basket = await BasketService.clearBasket(basketId);
      res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  // удаление Корзины
  async deleteBasket(basketId: number) {}

  // удаление Корзины с Товарами
  async removeBasket(req, res, next) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketService.createBasket();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const basket = await BasketService.removeBasket(
        basketId,
        req.params.productId
      );
      res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new BasketController();
