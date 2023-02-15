// ^ Service(Бизнес логика - БД и выход.парам.(НЕ req,res))

// от ошб.повтор.объяв.перем в блоке
export {};

const ApiError = require("../error/ApiError");
const { Device, DeviceInfo } = require("../models/modelsTS.ts");

class DeviceService {
  async create(
    name: string,
    price: number,
    deviceId: number,
    typeId: number,
    info
  ) {
    try {
      const deviceVerif = await Device.findOne({
        where: { name },
      });
      if (deviceVerif) {
        return ApiError.BadRequest(`Устройство ${name} уже существует`); // throw не раб
      }
      const device = await Device.create({
        name,
        price,
        deviceId,
        typeId,
        info,
      });
      return device;
      // {
      //   message: `Устройство ${name} создан.`,
      //   device,
      // };
    } catch (error) {
      return ApiError.BadRequest(`Ошибка создания - ${error}.`);
    }
  }

  async getAll(
    deviceId: number,
    typeId: number,
    limit: number,
    offset: number
  ) {
    try {
      let devices;
      // проверки с обращ.к БД с поиском всех
      // нет ничего
      if (!deviceId && !typeId) {
        // `найти и подсчитать все` findAndCountAll
        devices = await Device.findAndCountAll({
          // к кажд.запр.добав. лимит и отступ
          limit,
          offset,
        });
      }
      // есть Бренд
      if (deviceId && !typeId) {
        devices = await Device.findAndCountAll({
          where: { deviceId },
          limit,
          offset,
        });
      }
      // есть Тип
      if (!deviceId && typeId) {
        devices = await Device.findAndCountAll({
          where: { typeId },
          limit,
          offset,
        });
      }
      // Оба есть
      if (deviceId && typeId) {
        devices = await Device.findAndCountAll({
          where: { typeId, deviceId },
          limit,
          offset,
        });
      }
      // const devices = await Device.findAndCountAll(); // findAndCountAll иногда в ошб.
      return devices.rows; // масс.объ.
      /* return {
        message: `Количесто ${devices.count}`,
        messageCount: devices.count,
        devicess: devices.rows,
        devices,
      }; */
    } catch (error) {
      return ApiError.BadRequest(`Ошибка на всех - ${error}.`);
    }
  }

  async getOne(id: number) {
    try {
      const deviceId = await Device.findOne({
        where: { id },
        // получ.масс.хар-ик(подгруж.сразу с эл.по id)
        include: [
          {
            model: DeviceInfo,
            as: "info",
          },
        ],
      });
      if (!deviceId) {
        return ApiError.BadRequest(`Устройство по ID_${id} не найден`);
      }
      return /* {message: deviceId.name, */ deviceId /* } */;
    } catch (error) {
      return ApiError.BadRequest(`Ошибка на одного - ${error}.`);
    }
  }

  // ! не раб
  async update(id: number, name: string) {
    try {
      const deviceId = await Device.findOne({ where: { id } });
      if (!deviceId) {
        return ApiError.BadRequest(`Устройство по ID_${id} не найден`);
      }
      const updDevice = await Device.update(
        { /* id, */ name },
        { where: { id: id } }
      );
      const deviceNew = await Device.findOne({ where: { id } });
      // const deviceDto = new UserDto(userNew);
      return /* {message: `Устройство ${name} обновлён. Код_${updDevice}`, */ /* deviceDto */ deviceNew /* } */;
    } catch (error) {
      return ApiError.BadRequest(`Ошибка обновления - ${error}.`);
    }
  }

  async delOne(id: number) {
    try {
      const device = await Device.findOne({ where: { id } });
      if (!device) {
        return ApiError.BadRequest(`Устройство с ID ${id} не найден`);
      }
      var deletDevice = await Device.destroy({ where: { id } });
      return /* {message: `Устройство по ID_${id}`,deletDevice: */ `КОД_${deletDevice}` /* } */;
    } catch (error) {
      return ApiError.BadRequest(`Ошибка на удаления - ${error}.`);
    }
  }

  async delAll(req, res, next) {
    // const id = req.query.id;
    // const devices = await Device.destroy();
    // return res.json(devices);
  }
}

module.exports = new DeviceService();
