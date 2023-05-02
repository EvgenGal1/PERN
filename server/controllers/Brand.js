import { Brand as BrandMapping } from "../models/mapping.js";
import AppError from "../error/AppError_Tok.js";

class Brand {
  async getAll(req, res, next) {
    try {
      const brands = await BrandMapping.findAll();
      res.json(brands);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id бренда");
      }
      const brand = await BrandMapping.findByPk(req.params.id);
      if (!brand) {
        throw new Error("Бренд не найден в БД");
      }
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const brand = await BrandMapping.create({ name: req.body.name });
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id бренда");
      }
      const brand = await BrandMapping.findByPk(req.params.id);
      if (!brand) {
        throw new Error("Бренд не найден в БД");
      }
      const name = req.body.name ?? brand.name;
      await brand.update({ name });
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id бренда");
      }
      const brand = await BrandMapping.findByPk(req.params.id);
      if (!brand) {
        throw new Error("Бренд не найден в БД");
      }
      await brand.destroy();
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Brand();
