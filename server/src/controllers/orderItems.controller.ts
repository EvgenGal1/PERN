// ^ controller Позиций Заказа
import { Request, Response, NextFunction } from 'express';

import OrderItemsService from '../services/orderItems.service';
import { parseId, validateData } from '../utils/validators';

class OrderItemsController {
  constructor() {
    // привязка мтд.к контексту клс.
    this.getAllOrderItems = this.getAllOrderItems.bind(this);
    this.getOneOrderItems = this.getOneOrderItems.bind(this);
    this.createOrderItems = this.createOrderItems.bind(this);
    this.updateOrderItems = this.updateOrderItems.bind(this);
    this.deleteOrderItems = this.deleteOrderItems.bind(this);
  }

  private readonly name = 'Заказа';
  private readonly item = 'Позиции Заказа';

  async getOneOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = parseId(req.params.orderId, this.name);
      const id = parseId(req.params.id, this.item);
      const item = await OrderItemsService.getOneOrderItems(orderId, id);
      res.status(200).json(item);
    } catch (error: unknown) {
      next(error);
    }
  }

  async getAllOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = parseId(req.params.orderId, this.name);
      const items = await OrderItemsService.getAllOrderItems(orderId);
      res.status(200).json(items);
    } catch (error: unknown) {
      next(error);
    }
  }

  async createOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = parseId(req.params.orderId, this.name);
      validateData(req.body, this.item);
      const item = await OrderItemsService.createOrderItems(orderId, req.body);
      res.status(201).json(item);
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = parseId(req.params.orderId, this.name);
      const id = parseId(req.params.id, this.item);
      validateData(req.body, this.item);
      const item = await OrderItemsService.updateOrderItems(
        orderId,
        id,
        req.body,
      );
      res.status(200).json(item);
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = parseId(req.params.orderId, this.name);
      const id = parseId(req.params.id, this.item);
      const item = await OrderItemsService.deleteOrderItems(orderId, id);
      res.status(200).json(item);
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new OrderItemsController();
