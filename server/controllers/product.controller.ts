import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
import ProductService from "../services/product.service";

class Product {
  async getAll(
    req /* : Request */ /* // ! от ошб.number не может назнач... для string */,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryId = null, brandId = null } = req.params;
      let {
        limit = null,
        page = null,
        sortOrd = null,
        sortField = null,
      } = req.query;
      // console.log(req);
      console.log(req.query);
      console.log(req.params);
      limit =
        limit && /[0-9]+/.test(limit) && parseInt(limit) && limit > 0
          ? parseInt(limit)
          : 20;
      page = page && /[0-9]+/.test(page) && parseInt(page) ? parseInt(page) : 1;
      console.log("limit = " + limit);
      sortOrd = sortOrd === null || sortOrd === "ASC" ? "ASC" : "DESC";
      const options = { categoryId, brandId, limit, page, sortOrd, sortField };
      const products = await ProductService.getAll(options);
      res.json(products);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id товара");
      }
      const product = await ProductService.getOne(Number(req.params.id));
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для создания");
      }
      const product = await ProductService.create(req.body, req.files?.image);
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id товара");
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для обновления");
      }
      const product = await ProductService.update(
        req.params.id,
        req.body,
        req.files?.image
      );
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id товара");
      }
      const product = await ProductService.delete(req.params.id);
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Product();
