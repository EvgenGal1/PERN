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
      console.log("req.body : " + req.body);
      console.log(req.body);
      console.log("req.body?.image : " + req.body?.image);
      console.log(req.body?.image);
      console.log(req.body?.image?.name);
      console.log("req.files?.image : " + req.files?.image);
      // console.log(req.files?.image);
      console.log("1 : " + 1);
      // console.log("req?.files : " + req?.files);
      console.log(req?.files);
      console.log("2 : " + 2);
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
