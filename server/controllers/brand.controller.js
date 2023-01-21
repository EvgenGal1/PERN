const { Brand } = require("../models/models");
// подкл.обраб.ошиб.
const ApiError = require("../error/ApiError");

class BrandController {
  async create(req, res, next) {
    try {
      const { name } = req.body;

      // проверки на Пустое/Занятое значения
      const nameAll = await Brand.findOne({
        where: { name },
      });
      if (name === "") {
        return next(ApiError.internal(`ПУСТОЕ Значение`));
      }
      if (nameAll) {
        return next(ApiError.internal(`Значение ${nameAll.name} ЗАНЯТО`));
      }

      const brand = await Brand.create({ name });
      return res.json(brand);
    } catch (error) {
      return next(ApiError.internal(`Ошб. - ${error}.`));
    }
  }

  async getAll(req, res) {
    try {
      const brands = await Brand.findAndCountAll();
      return res.json(brands);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // fn получ.1го устройства по id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      // ? нужно это проверять
      // if (!id) {
      //   return next(ApiError.internal(`ID не указан`));
      // }
      const brand = await Brand.findOne({
        where: { id },
      });
      if (!brand) {
        return next(ApiError.internal(`Бренд с ID ${id} не найден`));
      }
      // const brand = await Brand.findById(id);
      return res.json(brand);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // ^ нужно прописать удалени конкретного и всех
  async update(req, res, next) {
    try {
      // const brand = req.body;
      const { id, name } = req.body;
      if (!id) {
        return next(ApiError.internal(`ID не передан`));
      }

      const brandId = await Brand.findOne({
        where: { id },
      });
      if (!brandId) {
        return next(ApiError.internal(`Бренд с ID ${id} не найден`));
      }

      const updBrands = await Brand.update(
        // ! ошб. "generatedMessage": false,
        // id,name,{ new: true }
        // ! ошб. "generatedMessage": false,"code":"ERR_ASSERTION",...
        // name, id
        // ! ошб. "generatedMessage": false,...
        // { where: { name, id } }
        // ^ обновил но вернул ток 1
        { name: name },
        {
          where: {
            id: id,
          },
        }
      );
      const brand = await Brand.findOne({
        where: { id },
      });
      // if (updBrands === 1) {
      //   return res.json(brand);
      // }
      return res.json(brand);
      // return res.json(updBrands);

      // ? не раб по NRJWT
      // const updBrands = await User.findByIdAndUpdate(id, name, { new: true });
      // return res.json(updBrands);
      // ? не раб. Другая БД
      // const updBrands = await pool.query(
      //   `UPDATE brands set name = $2 WHERE id = $1 RETURNING *`,
      //   [id, name]
      // );
      // res.json(updBrands);
      // ? не раб.
      // const updBrands = await Brand.findOne({ where: { id, name } });
      // /* {new: true,} */
      // return res.json({ message: `${brand.id}, ${brand.name}` });
      // return res.json({ message: `${id}, ${name}` /* updBrands */ });
      // handleResult(updBrands);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async delOne(req, res, next) {
    try {
      // проверка отсутств.ID
      const { id, name } = req.params;
      if (!id) {
        return next(ApiError.internal(`ID не передан`));
      }

      // проверка наличия ID
      const brandId = await Brand.findOne({
        where: { id },
      });
      if (!brandId) {
        return next(ApiError.internal(`Бренд с ID ${id} не найден`));
      }

      // УДАЛЕНИЕ
      const brandDel = await Brand.destroy({
        where: { id },
      });

      // ? нужно проверка удаления с const/if
      // const brand = await Brand.findOne({where: { id } });
      // if (!brand) {
      return res.json({
        message: `Элемент ${brandId.name} с ID ${id} УДАЛЁН`,
      });
      // }

      // return res.json(brand); // вернёт объ.которого уже нет || 2раза вызов по ID
      // return res.json(brandDel); // 1 - удалён, 0 - нет
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // async delAll(req, res) {
  //     const brands = await Brand.findAll()
  //     return res.json(brands)
  // }
}

module.exports = new BrandController();
