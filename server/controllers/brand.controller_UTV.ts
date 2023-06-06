// от ошб.повтор.объяв.перем в блоке
export {};

const ApiErrorJS = require("../error/ApiErrorJS");
const { Brand } = require("../models/modelsTS");
const BrandService = require("../services/brand.service_UTV");

// всё в упрощ.вар.
class BrandController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return next(ApiErrorJS.internal(`Name не передан`));
      }
      const brand = await BrandService.create(name);
      return res.json(brand);
    } catch (error) {
      next(`НЕ удалось добавить Бренд - ${error}.`);
    }
  }

  async getAll(req, res, next) {
    try {
      const brands = await BrandService.getAll();
      return res.json(brands);
    } catch (error) {
      next(`НЕ удалось получить Бренды - ${error}.`);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return next(ApiErrorJS.internal(`ID не передан`));
      }
      const brandId = await BrandService.getOne(id);
      return res.json(brandId);
    } catch (error) {
      next(`НЕ удалось по ID - ${error}.`);
    }
  }

  async update(req, res, next) {
    try {
      const { id, name } = req.body;
      if (!id || !name) {
        return next(ApiErrorJS.internal(`ID или Name не передан`));
      }
      const brandUpd = await BrandService.update(id, name);
      return res.json(brandUpd);
    } catch (error) {
      next(`НЕ обновлён - ${error}.`);
    }
  }

  async delOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return next(ApiErrorJS.internal(`ID не передан`));
      }
      const delBrand = await BrandService.delOne(id);
      return res.json(delBrand);
    } catch (error) {
      next(`НЕ удалён - ${error}.`);
    }
  }

  async delAll(req, res, next) {
    // const id = req.query.id;
    // const brands = await Brand.destroy();
    // return res.json(brands);
  }
}

module.exports = new BrandController();
