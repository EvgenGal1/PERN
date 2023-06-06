// от ошб.повтор.объяв.перем в блоке
export {};

// подкл.генир.уник.рандом.id
const uuid = require("uuid");
// подкл.для созд.пути
const path = require("path");
// подкл.модели Типа, Инфо.обУстр
const { Device, DeviceInfo } = require("../models/modelsTS.ts");
// подкл.обраб.ошиб.
const ApiErrorJS = require("../error/ApiErrorJS");
const FileService = require("../services/file.service_UTV.ts");
const DeviceService = require("../services/device.service.ts");

class DeviceController {
  async create(req, res, next) {
    try {
      // из тела запр. получ. назв.,цену,id-бренда,типа,назв.поля(info) у масс.характиристик из связи modal.Device-Info
      let { name, price, brandId, typeId, info } = req.body;
      if (!name) {
        return next(ApiErrorJS.internal(`Name не передан`));
      }
      if (!price) {
        return next(ApiErrorJS.internal(`Price не передан`));
      }
      // получ изо
      const { img } = req.files;
      const fileName = FileService.saveFile(img);

      // созд.Устройство передав парам.(рейтинг не передаём,по умолч.0)
      // const device = await Device.create({name,price,brandId,typeId,img: fileName});
      const device = await DeviceService.create(
        name,
        price,
        brandId,
        typeId,
        /* img: */ fileName
      );
      console.log("SRV.dev.cntrl typeId : " + typeId);

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
    } catch (error) {
      // при ошб.подкл.след.обраб.ошиб.
      next(`НЕ удалось добавить Бренд - ${error}.`);
      // next(ApiErrorJS.BadRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      // из стр.запроса получ.id Бренда,Типа,лимит кол-ва,стр
      let { brandId, typeId, limit, page } = req.query;
      // страницы. е/и не указ.=1
      page = page || 1;
      // кол-во.эл.на стр. е/и не указ.=9
      limit = limit || 9;
      // отступ по стр.и кол-ву эл.
      let offset = page * limit - limit;

      const devices = await DeviceService.getAll(
        brandId,
        typeId,
        limit,
        offset
      );
      // возвращ.масс.Устройств
      return res.json(devices);
    } catch (error) {
      next(`НЕ удалось получить Устройство - ${error}.`);
    }
  }

  // fn получ.1го устройства по id
  async getOne(req, res, next) {
    try {
      // получ.ID из парам.запроса(парам.пропис.в router)
      const { id } = req.params;
      if (!id) {
        return next(ApiErrorJS.internal(`ID не передан`));
      }
      const deviceId = await DeviceService.getOne(id);
      return res.json(deviceId);
    } catch (error) {
      next(`НЕ удалось по ID - ${error}.`);
    }
  }

  // ^ нужно прописать удалени конкретного и всех

  async update(req, res, next) {
    try {
      const { id, name } = req.body;
      if (!id || !name) {
        return next(ApiErrorJS.internal(`ID или Name не передан`));
      }
      const deviceUpd = await DeviceService.update(id, name);
      return res.json(deviceUpd);
    } catch (error) {
      next(`НЕ обновлён - ${error}.`);
    }
  }
  async delAll(req, res) {
    //     const brands = await Brand.findAll()
    //     return res.json(brands)
  }
  async delOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return next(ApiErrorJS.internal(`ID не передан`));
      }
      const delDevice = await DeviceService.delOne(id);
      return res.json(delDevice);
    } catch (error) {
      next(`НЕ удалён - ${error}.`);
    }
  }
}

module.exports = new DeviceController();
