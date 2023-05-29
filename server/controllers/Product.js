import ProductModel from "../services/Product.js";
import AppError from "../error/AppError_Tok.js";
import FileService from "../services/File.js";

class Product {
  async getAll(req, res, next) {
    try {
      const { categoryId = null, brandId = null } = req.params;
      // limit - количество товаров на странице; page - товары какой страницы возвращать
      // ^ тесты GET для страниц и кол-ва товаров на стр. - http://localhost:5050/api/product/getall/?page=3&limit=2
      let { limit = null, page = null } = req.query;
      // ^ ограничение колличества (limit) товаров на странице
      limit =
        limit && /[0-9]+/.test(limit) && parseInt(limit) ? parseInt(limit) : 5; //16
      page = page && /[0-9]+/.test(page) && parseInt(page) ? parseInt(page) : 1;
      const options = { categoryId, brandId, limit, page };
      // const products = await ProductModel.getAll(req.params);
      const products = await ProductModel.getAll(options);
      res.json(products);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id товара");
      }
      const product = await ProductModel.getOne(req.params.id);
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для создания");
      }
      const product = await ProductModel.create(req.body, req.files?.image);
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id товара");
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для обновления");
      }
      const product = await ProductModel.update(
        req.params.id,
        req.body,
        req.files?.image
      );
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id товара");
      }
      const product = await ProductModel.delete(req.params.id);
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Product();
