import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
import OrderService from "../services/order.service";
import BasketService from "../services/basket.service";
import UserService from "../services/user.service";

class Order {
  // созд.admin
  adminCreate = async (req, res, next) => {
    await this.create(req, res, next, "admin");
  };
  // созд.user
  userCreate = async (req, res, next) => {
    await this.create(req, res, next, "user");
  };
  // созд.guest
  guestCreate = async (req, res, next) => {
    await this.create(req, res, next, "guest");
  };

  // созд.общ.
  async create(req /* : Request */, res: Response, next: NextFunction, type) {
    try {
      console.log("SRV ord.cntrl CRT req.body : " + req.body);
      console.log(req.body);

      const { name, email, phone, address, comment = null } = req.body;
      // данные для создания заказа
      if (!name) throw new Error("Не указано имя покупателя");
      if (!email) throw new Error("Не указан email покупателя");
      if (!phone) throw new Error("Не указан телефон покупателя");
      if (!address) throw new Error("Не указан адрес доставки");

      let items,
        userId = null;
      if (type === "admin") {
        console.log("SRV ord.cntrl CRT type : " + type);
        console.log("SRV ord.cntrl CRT req.body.items : " + req.body.items);
        // когда заказ делает админ, id пользователя и состав заказа в теле запроса
        if (!req.body.items) throw new Error("Не указан состав заказа");
        if (req.body.items.length === 0)
          throw new Error("Не указан состав заказа");
        items = req.body.items;
        // проверяем существование пользователя
        userId = req.body.userId ?? null;
        if (userId) {
          await UserService.getOne(userId); // будет исключение, если не найден
        }
      } else {
        // когда заказ делает обычный пользователь (авторизованный или нет), состав заказа получаем из корзины, а id пользователя из req.auth.id (если есть)
        if (!req.signedCookies.basketId) {
          throw new Error("Ваша корзина пуста");
        }
        const basket = await BasketService.getOne(
          parseInt(req.signedCookies.basketId)
        );
        if (basket.products.length === 0) {
          throw new Error("Ваша корзина пуста");
        }
        items = basket.products;
        userId = req.auth?.id ?? null;
      }

      // все готово, можно создавать
      const order = await OrderService.create(
        {
          name,
          email,
          phone,
          address,
          comment,
          items,
          userId,
        }
        // req.body
      );
      console.log("SRV ord.cntrl CRT order : " + order);

      // корзину теперь нужно очистить
      await BasketService.clear(parseInt(req.signedCookies.basketId));
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
  // ADMIN ord
  async adminGetAll(req, res, next) {
    console.log("SRV ord.cntrl adminGetAll req : " + req);
    try {
      const orders = await OrderService.getAll();
      res.json(orders);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async adminGetUser(req, res, next) {
    console.log("SRV ord.cntrl adminGetUser req : " + req);
    try {
      if (!req.params.id) {
        throw new Error("Не указан id пользователя");
      }
      const order = await OrderService.getAll(req.params.id);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async adminGetOne(req, res, next) {
    console.log("SRV ord.cntrl adminGetOne 1 : " + 1);
    try {
      if (!req.params.id) {
        throw new Error("Не указан id заказа");
      }
      console.log("SRV ord.cntrl adminGetOne 2 : " + 2);
      const order = await OrderService.getOne(req.params.id);
      console.log("SRV ord.cntrl adminGetOne 3 : " + 3);
      console.log("SRV ord.cntrl adminGetOne order : " + order);
      // console.log(order);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async adminUpdate(req: Request, res: Response, next: NextFunction) {
    console.log("SRV ord.cntrl adminUpdate 1 : " + 1);
    console.log("SRV ord.cntrl UPD req.body : " + req.body);
    try {
      console.log("SRV ord.cntrl adminUpdate 2 : " + 2);
      if (!req.params.id) {
        console.log("SRV ord.cntrl adminUpdate err : " + 2.1);
        throw new Error("Не указан id заказа");
      }
      if (Object.keys(req.body).length === 0) {
        console.log("SRV ord.cntrl adminUpdate err : " + 2.2);
        throw new Error("Нет данных для обновления");
      }
      // if (!req.body.name) {
      //   throw new Error("Нет названия заказа");
      // }
      console.log("SRV ord.cntrl adminUpdate 3 : " + 3);
      const order = await OrderService.update(req.params.id, req.body);
      res.json(order);
      console.log("SRV ord.cntrl adminUpdate 4 : " + 4);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async adminDelete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id заказа");
      }
      const order = await OrderService.delete(req.params.id);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
  // USER ord
  async userGetAll(req, res, next) {
    try {
      const orders = await OrderService.getAll(req.auth.id);
      res.json(orders);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async userGetOne(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id заказа");
      }
      const order = await OrderService.getOne(req.params.id, req.auth.id);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Order();
