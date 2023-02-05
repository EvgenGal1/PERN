const ApiError = require("../error/ApiError");
const { Type } = require("../models/models");
const TypeService = require("../services/type.service.js");

// всё в упрощ.вар.
class TypeController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      // созд.Тип
      const type = await TypeService.create(name);
      return res.json(type);
    } catch (error) {
      next(`НЕ удалось добавить Тип - ${error}.`);
    }
  }

  async getAll(req, res, next) {
    // `найти все`
    const types = await Type.findAll();
    return res.json(types);
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const typeVerif = await Type.findOne({ where: { id } });
      if (!typeVerif) {
        return next(ApiError.BadRequest(`Тип по ID_${id} не найден`));
      }
      const type = await Type.findOne({
        where: { id },
      });
      return res.json(type);
    } catch (error) {}
  }

  // ! не раб
  async update(req, res, next) {
    // try {
    //   // const { id, name } = req.body;
    //   const { id, name } = req.params;
    //   const types = await Type.update(
    //     // { where: { id, name } }
    //     { id, name }
    //   );
    //   return res.json(types);
    // } catch (error) {}
  }

  // ! не раб
  async delAll(req, res, next) {
    // const id = req.query.id;
    // const types = await Type.destroy();
    // return res.json(types);
  }

  async delOne(req, res, next) {
    try {
      const { id, name } = req.params;
      const type = await Type.destroy({
        where: { id },
      });
      res.json(type);
      // if (type) {
      // res
      //   // return res.status(500)
      //   .json({
      //     /*  type, */ message: `Тип удалён. id - ${id}. name - ${name}`,
      //   });
      // }
    } catch (error) {
      // ! не раб
      const { id, name } = req.body;
      // const { id, name } = req.params;
      // общ.отв. на серв.ошб. в json смс
      res.json(`Не удоль удалить Тип ${name} ${id}.`);
    }
  }
}

module.exports = new TypeController();
