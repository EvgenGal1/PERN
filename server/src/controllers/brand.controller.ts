import { Request, Response, NextFunction } from 'express';

import AppError from '../middleware/errors/ApiError';
import BrandService from '../services/brand.service';

class BrandController {
  async getAllBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await BrandService.getAllBrand();
      res.json(brands);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async getOneBrand(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id Бренда');
      }
      const brand = await BrandService.getOneBrand(+req.params.id);
      res.json(brand);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async createBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await BrandService.createBrand(req.body);
      res.json(brand);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async updateBrand(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id Бренда');
      }
      const brand = await BrandService.updateBrand(+req.params.id, req.body);
      res.json(brand);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async deleteBrand(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id Бренда');
      }
      const brand = await BrandService.deleteBrand(+req.params.id);
      res.json(brand);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
}

export default new BrandController();
