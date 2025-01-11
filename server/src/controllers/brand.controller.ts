import { Request, Response, NextFunction } from 'express';

import ApiError from '../middleware/errors/ApiError';
import BrandService from '../services/brand.service';

class BrandController {
  async getAllBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await BrandService.getAllBrand();
      res.status(200).json(brands);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async getOneBrand(req: Request, res: Response, next: NextFunction) {
    try {
      if (isNaN(+req.params.id))
        throw new ApiError(400, 'Некорректный ID Бренда');
      const brand = await BrandService.getOneBrand(+req.params.id);
      res.status(200).json(brand);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async createBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      if (!name || typeof name !== 'string')
        throw new ApiError(400, 'Некорректное название Бренда');
      const brand = await BrandService.createBrand({ name });
      res.status(201).json(brand);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async updateBrand(req: Request, res: Response, next: NextFunction) {
    try {
      if (isNaN(+req.params.id))
        throw new ApiError(400, 'Некорректный ID Бренда');
      if (!req.body.name) throw new ApiError(400, 'Нет названия Бренда');
      const brand = await BrandService.updateBrand(+req.params.id, req.body);
      res.status(200).json(brand);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async deleteBrand(req: Request, res: Response, next: NextFunction) {
    try {
      if (isNaN(+req.params.id))
        throw new ApiError(400, 'Некорректный ID Бренда');
      await BrandService.deleteBrand(+req.params.id);
      res.status(200).json({ message: 'Бренд успешно удален' });
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
}

export default new BrandController();
