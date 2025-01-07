import { Request, Response, NextFunction } from 'express';

import AppError from '../middleware/errors/ApiError';
import CategoryService from '../services/category.service';

class CategoryController {
  async getAllCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAllCategory();
      res.status(200).json(categories);
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
      if (isNaN(+req.params.id))
        throw new AppError(400, 'Некорректный ID Категории');
      const category = await CategoryService.getOneCategory(+req.params.id);
      res.status(200).json(category);
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
      const { name } = req.body;
      if (!name || typeof name !== 'string')
        throw new AppError(400, 'Название категории обязательно');
      const category = await CategoryService.createCategory({ name });
      res.status(201).json(category);
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
      if (isNaN(+req.params.id))
        throw new AppError(400, 'Некорректный ID Категории');
      if (!req.body.name) throw new AppError(400, 'Нет названия Категории');
      const category = await CategoryService.updateCategory(
        +req.params.id,
        req.body,
      );
      res.status(200).json(category);
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
      if (isNaN(+req.params.id))
        throw new AppError(400, 'Некорректный ID Категории');
      await CategoryService.deleteCategory(+req.params.id);
      res.status(200).json({ message: 'Категория успешно удалена' });
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
