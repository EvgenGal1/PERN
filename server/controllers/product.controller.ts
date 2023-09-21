import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
import ProductService from "../services/product.service";

class Product {
  async getAllProduct(
    req /* : Request */ /* // ! от ошб.number не может назнач... для string */,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryId = null, brandId = null } = req.params;
      let {
        categoryId_q = null,
        brandId_q = null,
        limit = null,
        page = null,
        sortOrd = null,
        sortField = null,
      } = req.query;

      limit =
        limit && /[0-9]+/.test(limit) && parseInt(limit) && limit > 0
          ? parseInt(limit)
          : 20;
      page = page && /[0-9]+/.test(page) && parseInt(page) ? parseInt(page) : 1;
      sortOrd = sortOrd === null || sortOrd === "ASC" ? "ASC" : "DESC";

      const options = {
        categoryId,
        categoryId_q,
        brandId,
        brandId_q,
        limit,
        page,
        sortOrd,
        sortField,
      };
      const products = await ProductService.getAllProduct(options);

      res.json(products);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOneProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id товара");
      }
      const product = await ProductService.getOneProduct(Number(req.params.id));
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для создания");
      }
      const product = await ProductService.createProduct(
        req.body,
        req.files?.image
      );
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id товара");
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для обновления");
      }
      const product = await ProductService.updateProduct(
        req.params.id,
        req.body,
        req.files?.image
      );
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id товара");
      }
      const product = await ProductService.deleteProduct(req.params.id);
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Product();
