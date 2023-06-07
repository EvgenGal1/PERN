import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
import BrandService from "../services/brand.service";

class Brand {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await BrandService.getAll();
      res.json(brands);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id бренда");
      }
      const brand = await BrandService.getOne(req.params.id);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await BrandService.create(req.body);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id бренда");
      }
      const brand = await BrandService.update(req.params.id, req.body);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id бренда");
      }
      const brand = await BrandService.delete(req.params.id);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Brand();
