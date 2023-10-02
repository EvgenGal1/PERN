import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
import OrderService from "../services/order.service";
import BasketService from "../services/basket.service";
import UserService from "../services/user.service";

class Order {
  // созд.admin`администратор`
  adminCreateOrder = async (req, res, next) => {
    await this.createOrder(req, res, next, "admin");
  };
  // созд.user`пользователь`
  userCreateOrder = async (req, res, next) => {
    await this.createOrder(req, res, next, "user");
  };
  // созд.guest`гость`
  guestCreateOrder = async (req, res, next) => {
    await this.createOrder(req, res, next, "guest");
  };

  // созд.общ.
  async createOrder(
    req /* : Request */,
    res: Response,
    next: NextFunction,
    type
  ) {
    try {
      const { name, email, phone, address, comment = null } = req.body;
      // данные для создания заказа
      if (!name) throw new Error("Не указано имя покупателя");
      if (!email) throw new Error("Не указан email покупателя");
      if (!phone) throw new Error("Не указан телефон покупателя");
      if (!address) throw new Error("Не указан адрес доставки");

      let items,
        userId = null;
      if (type === "admin") {
        // когда заказ делает админ, id пользователя и состав заказа в теле запроса
        if (!req.body.items) throw new Error("Не указан состав заказа");
        if (req.body.items.length === 0)
          throw new Error("Не указан состав заказа");
        items = req.body.items;
        // проверяем существование пользователя
        userId = req.body.userId ?? null;
        if (userId) {
          await UserService.getOneUser(userId); // будет исключение, если не найден
        }
      } else {
        // когда заказ делает обычный пользователь (авторизованный или нет), состав заказа получаем из корзины, а id пользователя из req.auth.id (если есть)
        if (!req.signedCookies.basketId) {
          throw new Error("Ваша корзина пуста");
        }
        const basket = await BasketService.getOneBasket(
          parseInt(req.signedCookies.basketId)
        );
        if (basket.products.length === 0) {
          throw new Error("Ваша корзина пуста");
        }
        items = basket.products;
        userId = req.auth?.id ?? null;
      }

      // все готово, можно создавать
      const order = await OrderService.createOrder({
        name,
        email,
        phone,
        address,
        comment,
        items,
        userId,
      });

      // корзину теперь нужно очистить
      await BasketService.clearBasket(parseInt(req.signedCookies.basketId));
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  // ADMIN ord
  async adminGetOneOrder(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id заказа");
      }
      const order = await OrderService.getOneOrder(Number(req.params.id));
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
  async adminGetOrder(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id пользователя");
      }
      const order = await OrderService.getAllOrder(req.params.id);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
  async adminGetAllOrder(req, res, next) {
    try {
      Order;
      const orders = await OrderService.getAllOrder();
      res.json(orders);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
  async adminUpdateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id заказа");
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для обновления");
      }
      // if (!req.body.name) {
      //   throw new Error("Нет названия заказа");
      // }
      const order = await OrderService.updateOrder(req.params.id, req.body);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
  async adminDeleteOrder(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id заказа");
      }
      const order = await OrderService.deleteOrder(req.params.id);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  // USER ord
  async userGetAllOrder(req, res, next) {
    try {
      const orders = await OrderService.getAllOrder(req.auth.id);
      res.json(orders);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
  async userGetOneOrder(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id заказа");
      }
      const order = await OrderService.getOneOrder(
        Number(req.params.id),
        Number(req.auth.id)
      );
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Order();
