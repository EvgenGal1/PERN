import { Product as ProductMapping } from "../models/mapping.js";
import AppError from "../error/AppError_Tok.js";
import FileService from "../services/File.js";

class Product {
  async getAll(req, res, next) {
    try {
      const products = await ProductMapping.findAll();
      res.json(products);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      console.log("params ", req.params);
      console.log("id ", req.params.id);
      if (!req.params.id) {
        // ! ошб. не раб. Не доходид до неё е/и нет /id после getone
        throw new Error("Не указан id товара");
      }
      const product = await ProductMapping.findByPk(req.params.id);
      if (!product) {
        throw new Error("Товар не найден в БД");
      }
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      // поскольку image не допускает null, задаем пустую строку
      const {
        name,
        price,
        image = "",
        categoryId = null,
        brandId = null,
      } = req.body;
      const product = await ProductMapping.create({
        name,
        price,
        image,
        categoryId,
        brandId,
      });
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    console.log("1 ", 1);
    try {
      console.log("2 ", 1);
      if (!req.params.id) {
        throw new Error("Не указан id товара");
      }
      const product = await ProductMapping.findByPk(req.params.id);
      if (!product) {
        throw new Error("Товар не найден в БД");
      }
      const name = req.body.name ?? product.name;
      const price = req.body.price ?? product.price;
      await product.update({ name, price });
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
      const product = await ProductMapping.findByPk(req.params.id);
      if (!product) {
        throw new Error("Товар не найден в БД");
      }
      await product.destroy();
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Product();
