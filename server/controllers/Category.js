import { Category as CategoryMapping } from "../models/mapping.js";
import AppError from "../error/AppError_Tok.js";

class Category {
  async getAll(req, res, next) {
    try {
      const categories = await CategoryMapping.findAll();
      res.json(categories);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id категории");
      }
      const category = await CategoryMapping.findByPk(req.params.id);
      if (!category) {
        throw new Error("Категория не найдена в БД");
      }
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const category = await CategoryMapping.create({ name: req.body.name });
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id категории");
      }
      const category = await CategoryMapping.findByPk(req.params.id);
      if (!category) {
        throw new Error("Категория не найдена в БД");
      }
      const name = req.body.name ?? category.name;
      await category.update({ name });
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id категории");
      }
      const category = await CategoryMapping.findByPk(req.params.id);
      if (!category) {
        throw new Error("Категория не найдена в БД");
      }
      await category.destroy();
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Category();
