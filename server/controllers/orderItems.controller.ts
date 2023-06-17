// ^ controller для свойств товара
import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
// import OrderService from "../services/order.service";
// import BasketService from "../services/basket.service";
// import UserService from "../services/user.service";
import OrderItemsService from "../services/orderItems.service";

class orderItems {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.orderId) {
        throw new Error("Не указан id товара");
      }
      const items = await OrderItemsService.getAll(req.params.orderId);
      res.json(items);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.orderId) {
        throw new Error("Не указан id товара");
      }
      if (!req.params.id) {
        throw new Error("Не указано id свойства");
      }
      const item = await OrderItemsService.getOne(
        req.params.orderId,
        req.params.id
      );
      res.json(item);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.orderId) {
        throw new Error("Не указан id товара");
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для создания");
      }
      const item = await OrderItemsService.create(req.params.orderId, req.body);
      res.json(item);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.orderId) {
        throw new Error("Не указан id товара");
      }
      if (!req.params.id) {
        throw new Error("Не указано id свойства");
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для обновления");
      }
      const item = await OrderItemsService.update(
        req.params.orderId,
        req.params.id,
        req.body
      );
      res.json(item);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.orderId) {
        throw new Error("Не указан id товара");
      }
      if (!req.params.id) {
        throw new Error("Не указано id свойства");
      }
      const item = await OrderItemsService.delete(
        req.params.orderId,
        req.params.id
      );
      res.json(item);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new orderItems();
