import { NextFunction, Request, Response } from 'express';

import ApiError from '../middleware/errors/ApiError';
import BasketService from '../services/basket.service';
import { COOKIE_OPTIONS } from '../config/api/cookies';

class BasketController {
  constructor() {
    // привязка мтд.к экземпл./конексту клс. > доступа в routes к this с getBasketId от ошб. // ! Cannot read properties of undefined (reading 'getBasketId')
    this.appendBasket = this.appendBasket.bind(this);
    this.getOneBasket = this.getOneBasket.bind(this);
    this.incrementBasket = this.incrementBasket.bind(this);
    this.decrementBasket = this.decrementBasket.bind(this);
    this.clearBasket = this.clearBasket.bind(this);
    this.removeBasket = this.removeBasket.bind(this);
    this.deleteBasket = this.deleteBasket.bind(this);
  }

  // получ.basketId из cookies
  private async getBasketId(req: Request): Promise<number> {
    const basketId = req.signedCookies.basketId;
    if (!basketId) throw ApiError.badRequest('ID не передан в cookies');
    return parseInt(basketId);
  }

  // добавить
  async appendBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const { productId, quantity } = req.params;
      const basket = await BasketService.appendBasket(
        basketId,
        +productId,
        +quantity,
      );
      res
        .cookie('basketId', basket.id, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(error);
    }
  }

  // получить одну
  async getOneBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const basket = await BasketService.getOneBasket(basketId);
      res
        .cookie('basketId', basket.id, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(error);
    }
  }

  // увелич.кол-во Товаров в Корзине
  async incrementBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const { productId, quantity } = req.params;
      const basket = await BasketService.incrementBasket(
        basketId,
        +productId,
        +quantity,
      );
      res
        .cookie('basketId', basket.id, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(error);
    }
  }

  // уменьш.кол-во Товаров в Корзине
  async decrementBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const { productId, quantity } = req.params;
      const basket = await BasketService.decrementBasket(
        basketId,
        +productId,
        +quantity,
      );
      res
        .cookie('basketId', basket.id, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(error);
    }
  }

  // очистка Корзины
  async clearBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const basket = await BasketService.clearBasket(basketId);
      res
        .cookie('basketId', basket.id, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(error);
    }
  }

  // удал.Корзины с Товарами
  async removeBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const basket = await BasketService.removeBasket(basketId);
      res
        .cookie('basketId', basketId, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(error);
    }
  }

  // удал.Корзины с Товарами (как в removeBasket но без проверок)
  async deleteBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = parseInt(req.params.basketId);
      const basket = await BasketService.deleteBasket(basketId);
      res.status(200).json(basket);
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new BasketController();
