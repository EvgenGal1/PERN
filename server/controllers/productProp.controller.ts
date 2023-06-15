// ^ controller для свойств товара
import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
import ProductPropService from "../services/productProp.service";

class ProductProp {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error("Не указан id товара");
      }
      const properties = await ProductPropService.getAll(req.params.productId);
      res.json(properties);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error("Не указан id товара");
      }
      if (!req.params.id) {
        throw new Error("Не указано id свойства");
      }
      const property = await ProductPropService.getOne(
        req.params.productId,
        req.params.id
      );
      res.json(property);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    console.log("SRV prodPROP.cntrl CRT req.body : " + req.body);
    try {
      if (!req.params.productId) {
        throw new Error("Не указан id товара");
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для создания");
      }
      const property = await ProductPropService.create(
        req.params.productId,
        req.body
      );
      res.json(property);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error("Не указан id товара");
      }
      if (!req.params.id) {
        throw new Error("Не указано id свойства");
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для обновления");
      }
      const property = await ProductPropService.update(
        req.params.productId,
        req.params.id,
        req.body
      );
      res.json(property);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error("Не указан id товара");
      }
      if (!req.params.id) {
        throw new Error("Не указано id свойства");
      }
      const property = await ProductPropService.delete(
        req.params.productId,
        req.params.id
      );
      res.json(property);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new ProductProp();
