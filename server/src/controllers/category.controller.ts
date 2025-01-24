import { Request, Response, NextFunction } from 'express';

import CategoryService from '../services/category.service';
import { parseId, validateName } from '../utils/validators';

class CategoryController {
  constructor() {
    // привязка мтд.к контексту клс.
    this.getAllCategory = this.getAllCategory.bind(this);
    this.getOneCategory = this.getOneCategory.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  private readonly name = 'Категории';

  async getOneCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      const category = await CategoryService.getOneCategory(id);
      res.status(200).json(category);
    } catch (error: unknown) {
      next(error);
    }
  }

  async getAllCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAllCategory();
      res.status(200).json(categories);
    } catch (error: unknown) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = validateName(req.body, this.name);
      const category = await CategoryService.createCategory({ name });
      res.status(201).json(category);
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      const { name } = validateName(req.body, this.name);
      const category = await CategoryService.updateCategory(id, { name });
      res.status(200).json(category);
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      const deletedCategory = await CategoryService.deleteCategory(id);
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
