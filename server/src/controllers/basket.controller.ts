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

  // получить одну Корзину
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

  // добавить Продукт в Корзину
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

  // увелич.кол-во Продуктов в Корзине
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

  // уменьш.кол-во Продуктов в Корзине
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
      const basket = await BasketService.clearBasketProducts(basketId);
      res
        .cookie('basketId', basket.id, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(error);
    }
  }

  // удал.Продукта из Корзины
  async removeBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const basket = await BasketService.removeBasketProduct(
        basketId,
        +req.params.productId,
      );
      res
        .cookie('basketId', basketId, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(error);
    }
  }

  // удал.Корзины с Продуктами
  async deleteBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const basket = await BasketService.deleteBasket(basketId);
      res.status(200).json(basket);
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new BasketController();
