import { Request, Response, NextFunction } from 'express';

import OrderService from '../services/order.service';
import BasketService from '../services/basket.service';
import UserService from '../services/user.service';
import { parseId, validateData } from '../utils/validators';
import { NameUserRoles } from '../types/role.interface';
import ApiError from '../middleware/errors/ApiError';

class OrderController {
  constructor() {
    // привязка мтд.к контексту клс.
    this.getOneOrder = this.getOneOrder.bind(this);
    this.getAllOrdersUser = this.getAllOrdersUser.bind(this);
    this.getAllOrdersAdmin = this.getAllOrdersAdmin.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
  }

  private readonly name = 'Заказа';
  // private readonly user = 'Пользователя';

  async getOneOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(+req.params.id, this.name);
      const isAdmin = req.auth?.roles?.some(
        (r) => r.role === NameUserRoles.ADMIN,
      );
      const userId = isAdmin ? undefined : req.auth?.id;
      // по ID Заказа и Пользователя или Заказ > Admin
      const order = await OrderService.getOneOrder(id, userId);
      res.status(200).json(order);
    } catch (error: unknown) {
      next(error);
    }
  }

  // Все Заказы Пользователя
  async getAllOrdersUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth?.id) throw ApiError.unauthorized('Не авторизован');
      const orders = await OrderService.getAllOrdersUser(req.auth.id);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  // Все Заказы Всех Пользователей > ADMIN
  async getAllOrdersAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth?.id) throw ApiError.unauthorized('Не авторизован');
      const orders = await OrderService.getAllOrdersAdmin();
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        username,
        email,
        phone,
        address,
        comment = null,
        products,
      } = req.body;
      const { roles = [], id: userId } = req.auth || {};
      if (!userId) throw ApiError.badRequest('ID Пользователя не найден');
      if (!username || !email || !phone || !address) {
        throw ApiError.badRequest('Отсутствуют обязательные поля');
      }

      let basketItems = products;
      // проверка на наличие Позиций в теле запроса
      if (!basketItems || basketItems.length === 0) {
        throw ApiError.badRequest('Не указаны Позиции Заказа');
      }
      let userRoles = roles.map((r) => r.role);
      if (
        userRoles.includes(NameUserRoles.USER) ||
        userRoles.includes(NameUserRoles.GUEST)
      ) {
        // проверка сущ. Пользователя
        if (userId) await UserService.getOneUser(userId);
        // получить Позиции Заказа из Корзины
        const basket = await BasketService.getOneBasket(
          +req.signedCookies.basketId,
        );
        if (!basket?.products.length)
          throw ApiError.badRequest('Корзина пуста');
        basketItems = basket.products;
      } else if (userRoles.includes(NameUserRoles.ADMIN)) {
        throw ApiError.badRequest('Логика для ADMIN в разработке');
      }
      const order = await OrderService.createOrder({
        username,
        userId,
        email,
        phone,
        address,
        comment,
        items: basketItems,
      });
      if (!userRoles.includes(NameUserRoles.ADMIN))
        await BasketService.clearBasketProducts(+req.signedCookies.basketId);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      validateData(req.body, this.name);
      const updatedOrder = await OrderService.updateOrder(id, req.body);
      res.status(200).json(updatedOrder);
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      // if (!req.params.id) throw ApiError.badRequest('Не указан ID Заказа');
      const id = parseId(req.params.id, this.name);
      if (!req.auth?.id) throw ApiError.badRequest('Не указан ID Пользователя');
      const order = await OrderService.deleteOrder(id);
      res.status(200).json(order);
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new OrderController();
