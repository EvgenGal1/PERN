import AppError from "../error/ApiError";
import BasketService from "../services/basket.service";
import ProductService from "../services/product.service";

const maxAge = 60 * 60 * 1000 * 24 * 365; // один год
const signed = true;

class Basket {
  async getOne(req, res, next) {
    try {
      let basket;
      if (req.signedCookies.basketId) {
        basket = await BasketService.getOne(
          parseInt(req.signedCookies.basketId)
        );
      } else {
        basket = await BasketService.create();
      }
      res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async append(req, res, next) {
    try {
      let basketId: number;
      if (!req.signedCookies.basketId) {
        let created = await BasketService.create();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const { productId, quantity } = req.params;
      const basket = await BasketService.append(basketId, productId, quantity);
      res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async increment(req, res, next) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketService.create();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const { productId, quantity } = req.params;
      const basket = await BasketService.increment(
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

  async decrement(req, res, next) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketService.create();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const { productId, quantity } = req.params;
      const basket = await BasketService.decrement(
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

  async remove(req, res, next) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketService.create();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const basket = await BasketService.remove(basketId, req.params.productId);
      res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async clear(req, res, next) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketService.create();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const basket = await BasketService.clear(basketId);
      res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Basket();
