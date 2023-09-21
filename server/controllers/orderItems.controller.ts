// ^ controller для свойств товара
import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
// import OrderService from "../services/order.service";
// import BasketService from "../services/basket.service";
// import UserService from "../services/user.service";
import OrderItemsService from "../services/orderItems.service";

class orderItems {
  async getAllOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.orderId) {
        throw new Error("Не указан id товара");
      }
      const items = await OrderItemsService.getAllOrderItems(
        req.params.orderId
      );
      res.json(items);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOneOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.orderId) {
        throw new Error("Не указан id товара");
      }
      if (!req.params.id) {
        throw new Error("Не указано id свойства");
      }
      const item = await OrderItemsService.getOneOrderItems(
        req.params.orderId,
        req.params.id
      );
      res.json(item);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async createOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.orderId) {
        throw new Error("Не указан id товара");
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для создания");
      }
      const item = await OrderItemsService.createOrderItems(
        req.params.orderId,
        req.body
      );
      res.json(item);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async updateOrderItems(req: Request, res: Response, next: NextFunction) {
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
      const item = await OrderItemsService.updateOrderItems(
        req.params.orderId,
        req.params.id,
        req.body
      );
      res.json(item);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async deleteOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.orderId) {
        throw new Error("Не указан id товара");
      }
      if (!req.params.id) {
        throw new Error("Не указано id свойства");
      }
      const item = await OrderItemsService.deleteOrderItems(
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
