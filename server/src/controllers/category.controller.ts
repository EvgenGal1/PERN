import { Request, Response, NextFunction } from 'express';

import ApiError from '../middleware/errors/ApiError';
import CategoryService from '../services/category.service';

class CategoryController {
  async getAllCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAllCategory();
      res.status(200).json(categories);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async getOneCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (isNaN(+req.params.id))
        throw new ApiError(400, 'Некорректный ID Категории');
      const category = await CategoryService.getOneCategory(+req.params.id);
      res.status(200).json(category);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      if (!name || typeof name !== 'string')
        throw new ApiError(400, 'Название категории обязательно');
      const category = await CategoryService.createCategory({ name });
      res.status(201).json(category);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (isNaN(+req.params.id))
        throw new ApiError(400, 'Некорректный ID Категории');
      if (!req.body.name) throw new ApiError(400, 'Нет названия Категории');
      const category = await CategoryService.updateCategory(
        +req.params.id,
        req.body,
      );
      res.status(200).json(category);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!+req.params.id) throw ApiError.badRequest('Не указан ID Категории');
      const deletedCategory = await CategoryService.deleteCategory(
        +req.params.id,
      );
      res.status(204).json({
        message: 'Категория успешно удалена',
        data: deletedCategory,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new CategoryController();
