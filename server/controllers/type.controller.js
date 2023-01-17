const { Type } = require("../models/models");
const ApiError = require("../error/ApiError");

// всё в упрощ.вар.
class TypeController {
  async create(req, res) {
    const { name } = req.body;
    // созд.Тип
    const type = await Type.create({ name });
    return res.json(type);
  }

  async getAll(req, res) {
    // `найти все`
    const types = await Type.findAll();
    return res.json(types);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const type = await Type.findOne({
      where: { id },
      // с этим отв.нет
      // include: [{ model: Type, as: "info" }],
    });
    return res.json(type);
  }

  // ! не раб
  async update(req, res) {
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
  async delAll(req, res) {
    // const id = req.query.id;
    // const types = await Type.destroy();
    // return res.json(types);
  }

  async delOne(req, res) {
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
      const { id, name } = req.body;
      // const { id, name } = req.params;
      // общ.отв. на серв.ошб. в json смс
      res.json(`Не удоль удалить Тип ${name} ${id}.`);
    }
  }
}

module.exports = new TypeController();
