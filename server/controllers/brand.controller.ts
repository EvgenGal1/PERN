import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
import BrandService from "../services/brand.service";

class BrandController {
  async getAllBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await BrandService.getAllBrand();
      res.json(brands);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOneBrand(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id бренда");
      }
      const brand = await BrandService.getOneBrand(req.params.id);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async createBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await BrandService.createBrand(req.body);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async updateBrand(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id бренда");
      }
      const brand = await BrandService.updateBrand(req.params.id, req.body);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async deleteBrand(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id бренда");
      }
      const brand = await BrandService.deleteBrand(req.params.id);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new BrandController();
