import { Request, Response, NextFunction } from 'express';

import AppError from '../middleware/errors/ApiError';
import CategoryService from '../services/category.service';

class CategoryController {
  async getAllCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAllCategory();
      res.json(categories);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async getOneCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id Категории');
      }
      const category = await CategoryService.getOneCategory(+req.params.id);
      res.json(category);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.name) {
        throw new Error('Нет названия Категории');
      }
      const category = await CategoryService.createCategory(req.body);
      res.json(category);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id Категории');
      }
      if (!req.body.name) {
        throw new Error('Нет названия Категории');
      }
      const category = await CategoryService.updateCategory(
        +req.params.id,
        req.body,
      );
      res.json(category);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id Категории');
      }
      const category = await CategoryService.deleteCategory(+req.params.id);
      res.json(category);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
}

export default new CategoryController();
