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
      const id = +req.params.id;
      if (isNaN(id)) throw new AppError(400, 'Некорректный ID');
      const brand = await BrandService.getOneBrand(id);
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
      const { name } = req.body;
      if (!name || typeof name !== 'string')
        throw new AppError(400, 'Некорректное название бренда');
      const brand = await BrandService.createBrand({ name });
      res.status(201).json(brand);
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
      const id = +req.params.id;
      const { name } = req.body;
      if (!name || typeof name !== 'string' || isNaN(id))
        throw new AppError(400, 'Некорректные данные для обновления');
      const brand = await BrandService.updateBrand(id, { name });
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
      const id = +req.params.id;
      if (isNaN(id)) throw new AppError(400, 'Некорректный ID');
      const brand = await BrandService.deleteBrand(id);
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
