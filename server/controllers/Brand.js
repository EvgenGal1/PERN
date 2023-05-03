import BrandModel from "../services/Brand.js";
import AppError from "../error/AppError_Tok.js";

class Brand {
  async getAll(req, res, next) {
    try {
      const brands = await BrandModel.getAll();
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
      const brand = await BrandModel.getOne(req.params.id);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const brand = await BrandModel.create(req.body);
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
      const brand = await BrandModel.update(req.params.id, req.body);
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
      const brand = await BrandModel.delete(req.params.id);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Brand();
