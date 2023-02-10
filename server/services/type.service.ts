// ^ Service(Бизнес логика - БД и выход.парам.(НЕ req,res))

// от ошб.повтор.объяв.перем в блоке
export {};

const ApiError = require("../error/ApiError");
const { Type } = require("../models/modelsTS.ts");

class TypeService {
  async create(name: string) {
    try {
      const typeVerif = await Type.findOne({
        where: { name },
      });
      if (typeVerif) {
        return ApiError.BadRequest(`Тип ${name} уже существует`); // throw не раб
      }
      const type = await Type.create({ name });
      return {
        message: `Тип ${name} создан.`,
        type,
      };
    } catch (error) {
      return ApiError.BadRequest(`Ошибка создания - ${error}.`);
    }
  }

  async getAll() {
    try {
      const types = await Type.findAndCountAll(); // findAndCountAll иногда в ошб.
      return types.rows; // масс.объ.
      /* return {
        message: `Количесто ${types.count}`,
        messageCount: types.count,
        typess: types.rows,
        types,
      }; */
    } catch (error) {
      return ApiError.BadRequest(`Ошибка на всех - ${error}.`);
    }
  }

  async getOne(id: number) {
    try {
      const typeId = await Type.findOne({ where: { id } });
      if (!typeId) {
        return ApiError.BadRequest(`Тип по ID_${id} не найден`);
      }
      return /* {message: typeId.name, */ typeId /* } */;
    } catch (error) {
      return ApiError.BadRequest(`Ошибка на одного - ${error}.`);
    }
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

module.exports = new TypeService();
