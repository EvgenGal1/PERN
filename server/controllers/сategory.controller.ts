import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
import CategoryService from "../services/category.service";

class Category {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAll();
      res.json(categories);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id категории");
      }
      const category = await CategoryService.getOne(req.params.id);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.name) {
        throw new Error("Нет названия категории");
      }
      const category = await CategoryService.create(req.body);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id категории");
      }
      if (!req.body.name) {
        throw new Error("Нет названия категории");
      }
      const category = await CategoryService.update(req.params.id, req.body);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id категории");
      }
      const category = await CategoryService.delete(req.params.id);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Category();
