import { NextFunction } from 'express';

import AppError from '../middleware/errors/ApiError';
import BasketService from '../services/basket.service';

const maxAge = 60 * 60 * 1000 * 24 * 365; // один год
const signed = true;

class BasketController {
  // добавить
  async appendBasket(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
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
        quantity,
      );
      res.cookie('basketId', basket.id, { maxAge, signed });
      res.json(basket);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // получить одну
  async getOneBasket(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
    try {
      let basket;
      if (req.signedCookies.basketId) {
        basket = await BasketService.getOneBasket(
          parseInt(req.signedCookies.basketId),
        );
      } else {
        // ! пересмотр.лог.по созд.
        basket = await BasketService.createBasket();
      }
      res.cookie('basketId', basket.id, { maxAge, signed });
      res.json(basket);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // увеличение
  async incrementBasket(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        // ! пересмотр.лог.по созд.
        let created = await BasketService.createBasket();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const { productId, quantity } = req.params;
      const basket = await BasketService.incrementBasket(
        basketId,
        productId,
        quantity,
      );
      res.cookie('basketId', basket.id, { maxAge, signed });
      res.json(basket);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // уменьшение
  async decrementBasket(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
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
        quantity,
      );
      res.cookie('basketId', basket.id, { maxAge, signed });
      res.json(basket);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // очистка
  async clearBasket(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketService.createBasket();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const basket = await BasketService.clearBasket(basketId);
      res.cookie('basketId', basket.id, { maxAge, signed });
      res.json(basket);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // удаление Корзины
  async deleteBasket(basketId: number) {}

  // удаление Корзины с Товарами
  async removeBasket(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
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
        req.params.productId,
      );
      res.cookie('basketId', basket.id, { maxAge, signed });
      res.json(basket);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
}

export default new BasketController();
