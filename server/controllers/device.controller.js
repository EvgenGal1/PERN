// подкл.генир.уник.рандом.id
const uuid = require("uuid");
// подкл.для созд.пути
const path = require("path");
// подкл.модели Типа, Инфо.обУстр
const { Device, DeviceInfo } = require("../models/modelsTS.ts");
// подкл.обраб.ошиб.
const ApiError = require("../error/ApiError");

class DeviceController {
  async create(req, res, next) {
    try {
      // из тела запр. получ. назв.,цену,id-бренда,типа,назв.поля(info) у масс.характиристик из связи modal.Device-Info
      let { name, price, brandId, typeId, info } = req.body;
      // получ изо
      const { img } = req.files;
      // генирир.уник.имя(ч/з fn v4 + формат)
      let fileName = uuid.v4() + ".jpg";
      // перемещ.файлы с клиента в static/
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      // созд.Устройство передав парам.(рейтинг не передаём,по умолч.0)
      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      // услов.для инфо
      if (info) {
        // парсим из стр.
        info = JSON.parse(info);
        // перебор масс.
        info.forEach((i) =>
          // для кажд.эл.масс.созд.структуру
          // ^ await не ставим от блок.потока.
          DeviceInfo.create({
            // заголовок и опис. из эл.итерации
            title: i.title,
            description: i.description,
            deviceId: device.id,
          })
        );
      }

      // возвращ.на клиента
      return res.json(device);
    } catch (e) {
      // при ошб.подкл.след.обраб.ошиб.
      next(ApiError.BadRequest(e.message));
    }
  }

  async getAll(req, res) {
    // из стр.запроса получ.id Бренда,Типа,лимит кол-ва,стр
    let { brandId, typeId, limit, page } = req.query;
    // страницы. е/и не указ.=1
    page = page || 1;
    // кол-во.эл.на стр. е/и не указ.=9
    limit = limit || 9;
    // отступ по стр.и кол-ву эл.
    let offset = page * limit - limit;
    let devices;

    // проверки с обращ.к БД с поиском всех
    // нет ничего
    if (!brandId && !typeId) {
      // `найти и подсчитать все` findAndCountAll
      devices = await Device.findAndCountAll({
        // к кажд.запр.добав. лимит и отступ
        limit,
        offset,
      });
    }
    // есть Бренд
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      });
    }
    // есть Тип
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      });
    }
    // Оба есть
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId, brandId },
        limit,
        offset,
      });
    }
    // возвращ.масс.Устройств
    return res.json(devices);
  }

  // fn получ.1го устройства по id
  async getOne(req, res) {
    // получ.ID из парам.запроса(парам.пропис.в router)
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      // получ.масс.хар-ик(подгруж.сразу с эл.по id)
      include: [
        {
          model: DeviceInfo,
          as: "info",
        },
      ],
    });
    return res.json(device);
  }

  // ^ нужно прописать удалени конкретного и всех

  async update(req, res) {
    //     const brands = await Brand.findAll()
    //     return res.json(brands)
  }
  async delAll(req, res) {
    //     const brands = await Brand.findAll()
    //     return res.json(brands)
  }
  async delOne(req, res) {
    //     const brands = await Brand.findAll()
    //     return res.json(brands)
  }
}

module.exports = new DeviceController();
