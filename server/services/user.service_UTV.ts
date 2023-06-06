// ^ Service(Бизнес логика - БД и выход.парам.(НЕ req,res))

// от ошб.повтор.объяв.перем в блоке
export {};

// подкл.конфиг.БД для записи получ.данн.в БД
const { pool } = require("../db");
const FileService = require("./file.service_UTV.ts");

// подкл.обраб.ошиб.
const ApiErrorJS = require("../error/ApiErrorJS");
// выборка полей
const UserDto = require("../dtos/user.dto.ts");
// подкл.модели пользователей и ролей. Можно разнести на отдельн.ф(User.ts,Role.ts,..)
const { User } = require("../models/modelsTS.ts");

class UserService {
  async getAllUserPERN() {
    try {
      const users = await User.findAndCountAll(); // findAndCountAll в ошб.
      const userDto = new UserDto(users.rows[0]); // [0] только первый обраб. Возм.нужен перебор ~map
      // ! ошб. - выгрузает всё из табл. Доработать чтоб выгружал ч/з ВЕЩ
      // console.log("===============================userDto : " + { ...userDto });
      // console.log(
      //   "===============================...userDto rows : " +
      //     { ...userDto.rows }
      // );
      // console.log(
      //   "===============================userDto rows : " + userDto.rows
      // );
      return users.rows;
      // {
      //   message: `Количесто ${users.count}`,
      //   userDto,
      //   2: 2,
      //   ...userDto,
      //   3: 3,
      //   usersS: userDto.rows /* , typesCoun */,
      //   users,
      // };
    } catch (error) {
      return ApiErrorJS.BadRequest(`Ошибка на всех - ${error}.`);
    }
  }

  async getOneUserPERN(id: number) {
    try {
      const userId = await User.findOne({ where: { id } });
      if (!userId) {
        return ApiErrorJS.BadRequest(`Пользователь с ID ${id} не найден`);
      }
      const userDto = new UserDto(userId);
      return /* { message: `Пользователь ${userDto.username}`, */ userDto /* } */;
    } catch (error) {
      return ApiErrorJS.BadRequest(`Ошибка на одного - ${error}.`);
    }
  }

  async updateUserPERN(
    id: number,
    username: string,
    email: string,
    password: string,
    role: string,
    isActivated: boolean
  ) {
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return ApiErrorJS.BadRequest(
          `Пользователь с Именем ${username} не найден`
        );
      }
      const updUser = await User.update(
        { id, username, email, password, role, isActivated },
        { where: { username: username } }
      );
      const userNew = await User.findOne({ where: { username } });
      const userDto = new UserDto(userNew);
      return /* {message: `Пользователь ${username} обновлён. Код_${updUser}`, */ userDto /* } */;
    } catch (error) {
      return ApiErrorJS.BadRequest(`Ошибка обновления - ${error}.`);
    }
  }

  async deleteUserPERN(id: number) {
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        return ApiErrorJS.BadRequest(`Пользователь с ID ${id} не найден`);
      }
      var deletUser = await User.destroy({ where: { id } });
      return /* {message: `Пользователь по ID_${id}`,deletUserS: */ `КОД_${deletUser}` /* } */;
    } catch (error) {
      return ApiErrorJS.BadRequest(`Ошибка на удаления - ${error}.`);
    }
  }
}

module.exports = new UserService();
