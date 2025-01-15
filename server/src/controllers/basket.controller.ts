import { NextFunction, Request, Response } from 'express';

import ApiError from '../middleware/errors/ApiError';
import BasketService from '../services/basket.service';
import { COOKIE_OPTIONS } from '../config/api/cookies';

class BasketController {
  constructor() {
    // привязка мтд. к экземпл.клс. > доступа routes к конексту this с getBasketId от ошб. // ! Cannot read properties of undefined (reading 'getBasketId')
    this.appendBasket = this.appendBasket.bind(this);
    this.getOneBasket = this.getOneBasket.bind(this);
    this.incrementBasket = this.incrementBasket.bind(this);
    this.decrementBasket = this.decrementBasket.bind(this);
    this.clearBasket = this.clearBasket.bind(this);
    this.removeBasket = this.removeBasket.bind(this);
  }

  // получ.basketId из cookies
  private async getBasketId(req: Request): Promise<number> {
    // private getBasketId = async (req: Request): Promise<number > => {
    const basketId = req.signedCookies.basketId;
    if (!basketId) throw ApiError.badRequest('ID не передан в cookies'); // ошб.без basketId в cookies
    return parseInt(basketId);
  }

  // добавить
  async appendBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const { productId, quantity } = req.params;
      const basket = await BasketService.appendBasket(
        basketId!,
        +productId,
        +quantity,
      );
      res
        .cookie('basketId', basket.id, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // получить одну
  async getOneBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const basket = await BasketService.getOneBasket(basketId!);
      res
        .cookie('basketId', basket.id, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // увеличение
  async incrementBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const { productId, quantity } = req.params;
      const basket = await BasketService.incrementBasket(
        basketId!,
        +productId,
        +quantity,
      );
      res
        .cookie('basketId', basket.id, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // уменьшение
  async decrementBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const { productId, quantity } = req.params;
      const basket = await BasketService.decrementBasket(
        basketId!,
        +productId,
        +quantity,
      );
      res
        .cookie('basketId', basket.id, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // очистка
  async clearBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const basket = await BasketService.clearBasket(basketId!);
      res
        .cookie('basketId', basket.id, COOKIE_OPTIONS.basketId)
        .status(200)
        .json(basket);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // удаление Корзины с Товарами
  async removeBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = await this.getBasketId(req);
      const basket = await BasketService.removeBasket(basketId!);
      res.cookie('basketId', basketId, COOKIE_OPTIONS.basketId).json(basket);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // удаление Корзины (с Товарами как в removeBasket но без проверок)
  async deleteBasket(req: Request, res: Response, next: NextFunction) {
    try {
      const basketId = parseInt(req.params.basketId);
      const basket = await BasketService.deleteBasket(basketId!);
      res.status(200).json(basket);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
}

export default new BasketController();
