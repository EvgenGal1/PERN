// ^ Service(Бизнес логика - БД и выход.парам.(НЕ req,res))

// от ошб.повтор.объяв.перем в блоке
export {};

const ApiErrorJS = require("../error/ApiErrorJS");
const { Type } = require("../models/modelsTS.ts");

class TypeService {
  async create(name: string) {
    try {
      const typeVerif = await Type.findOne({
        where: { name },
      });
      if (typeVerif) {
        return ApiErrorJS.BadRequest(`Тип ${name} уже существует`); // throw не раб
      }
      const type = await Type.create({ name });
      return {
        message: `Тип ${name} создан.`,
        type,
      };
    } catch (error) {
      return ApiErrorJS.BadRequest(`Ошибка создания - ${error}.`);
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
      return ApiErrorJS.BadRequest(`Ошибка на всех - ${error}.`);
    }
  }

  async getOne(id: number) {
    try {
      const typeId = await Type.findOne({ where: { id } });
      if (!typeId) {
        return ApiErrorJS.BadRequest(`Тип по ID_${id} не найден`);
      }
      return /* {message: typeId.name, */ typeId /* } */;
    } catch (error) {
      return ApiErrorJS.BadRequest(`Ошибка на одного - ${error}.`);
    }
  }

  // ! не раб
  async update(id: number, name: string) {
    try {
      const typeId = await Type.findOne({ where: { id } });
      if (!typeId) {
        return ApiErrorJS.BadRequest(`Тип по ID_${id} не найден`);
      }
      const updType = await Type.update(
        { /* id, */ name },
        { where: { id: id } }
      );
      const typeNew = await Type.findOne({ where: { id } });
      // const typeDto = new UserDto(userNew);
      return /* {message: `Тип ${name} обновлён. Код_${updType}`, */ /* typeDto */ typeNew /* } */;
    } catch (error) {
      return ApiErrorJS.BadRequest(`Ошибка обновления - ${error}.`);
    }
  }

  async delOne(id: number) {
    try {
      const typeId = await Type.findOne({ where: { id } });
      if (!typeId) {
        return ApiErrorJS.BadRequest(`Тип с ID ${id} не найден`);
      }
      var deletType = await Type.destroy({ where: { id } });
      return /* {message: `Тип по ID_${id}`,deletType: */ `КОД_${deletType}` /* } */;
    } catch (error) {
      return ApiErrorJS.BadRequest(`Ошибка на удаления - ${error}.`);
    }
  }

  async delAll(req, res, next) {
    // const id = req.query.id;
    // const types = await Type.destroy();
    // return res.json(types);
  }
}

module.exports = new TypeService();
