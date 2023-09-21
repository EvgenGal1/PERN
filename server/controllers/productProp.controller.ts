// ^ controller для свойств товара
import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
import ProductPropService from "../services/productProp.service";

class ProductProp {
  async getAllProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error("Не указан id товара");
      }
      const properties = await ProductPropService.getAllProdProp(
        req.params.productId
      );
      res.json(properties);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOneProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error("Не указан id товара");
      }
      if (!req.params.id) {
        throw new Error("Не указано id свойства");
      }
      const property = await ProductPropService.getOneProdProp(
        req.params.productId,
        req.params.id
      );
      res.json(property);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async createProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error("Не указан id товара");
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для создания");
      }
      const property = await ProductPropService.createProdProp(
        req.params.productId,
        req.body
      );
      res.json(property);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async updateProdProp(req: Request, res: Response, next: NextFunction) {
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
      const property = await ProductPropService.updateProdProp(
        req.params.productId,
        req.params.id,
        req.body
      );
      res.json(property);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async deleteProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error("Не указан id товара");
      }
      if (!req.params.id) {
        throw new Error("Не указано id свойства");
      }
      const property = await ProductPropService.deleteProdProp(
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
