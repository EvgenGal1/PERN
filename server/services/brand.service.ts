// ^ Service(Бизнес логика - БД и выход.парам.(НЕ req,res))

// от ошб.повтор.объяв.перем в блоке
export {};

const ApiError = require("../error/ApiError");
const { Brand } = require("../models/modelsTS.ts");

class BrandService {
  async create(name: string) {
    try {
      const brandVerif = await Brand.findOne({
        where: { name },
      });
      if (brandVerif) {
        return ApiError.BadRequest(`Бренд ${name} уже существует`); // throw не раб
      }
      const brand = await Brand.create({ name });
      return brand;
      // {
      //   message: `Бренд ${name} создан.`,
      //   brand,
      // };
    } catch (error) {
      return ApiError.BadRequest(`Ошибка создания - ${error}.`);
    }
  }

  async getAll() {
    try {
      const brands = await Brand.findAndCountAll(); // findAndCountAll иногда в ошб.
      return brands.rows; // масс.объ.
      /* return {
        message: `Количесто ${brands.count}`,
        messageCount: brands.count,
        brandss: brands.rows,
        brands,
      }; */
    } catch (error) {
      return ApiError.BadRequest(`Ошибка на всех - ${error}.`);
    }
  }

  async getOne(id: number) {
    try {
      const brandId = await Brand.findOne({ where: { id } });
      if (!brandId) {
        return ApiError.BadRequest(`Бренд по ID_${id} не найден`);
      }
      return /* {message: brandId.name, */ brandId /* } */;
    } catch (error) {
      return ApiError.BadRequest(`Ошибка на одного - ${error}.`);
    }
  }

  // ! не раб
  async update(id: number, name: string) {
    try {
      const brandId = await Brand.findOne({ where: { id } });
      if (!brandId) {
        return ApiError.BadRequest(`Бренд по ID_${id} не найден`);
      }
      const updBrand = await Brand.update(
        { /* id, */ name },
        { where: { id: id } }
      );
      const brandNew = await Brand.findOne({ where: { id } });
      // const brandDto = new UserDto(userNew);
      return /* {message: `Бренд ${name} обновлён. Код_${updBrand}`, */ /* brandDto */ brandNew /* } */;
    } catch (error) {
      return ApiError.BadRequest(`Ошибка обновления - ${error}.`);
    }
  }

  async delOne(id: number) {
    try {
      const brand = await Brand.findOne({ where: { id } });
      if (!brand) {
        return ApiError.BadRequest(`Бренд с ID ${id} не найден`);
      }
      var deletBrand = await Brand.destroy({ where: { id } });
      return /* {message: `Бренд по ID_${id}`,deletBrand: */ `КОД_${deletBrand}` /* } */;
    } catch (error) {
      return ApiError.BadRequest(`Ошибка на удаления - ${error}.`);
    }
  }

  async delAll(req, res, next) {
    // const id = req.query.id;
    // const brands = await Brand.destroy();
    // return res.json(brands);
  }
}

module.exports = new BrandService();
