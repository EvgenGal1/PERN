import { User as UserMapping } from "../models/mapping.js";
import AppError from "../error/AppError_Tok.js";

class User {
  async getAll() {
    const users = await UserMapping.findAll();
    return users;
  }

  async getOne(id) {
    const user = await UserMapping.findByPk(id);
    if (!user) {
      throw new Error("Пользователь не найден в БД");
    }
    return user;
  }

  async getByEmail(email) {
    const user = await UserMapping.findOne({ where: { email } });
    if (!user) {
      throw new Error("Пользователь не найден в БД");
    }
    return user;
  }

  async create(data) {
    const { email, password, role } = data;
    const check = await UserMapping.findOne({ where: { email } });
    if (check) {
      throw new Error("Пользователь уже существует");
    }
    const user = await UserMapping.create({ email, password, role });
    return user;
  }

  async update(id, data) {
    const user = await UserMapping.findByPk(id);
    if (!user) {
      throw new Error("Пользователь не найден в БД");
    }
    const {
      email = user.email,
      password = user.password,
      role = user.role,
    } = data;
    await user.update({ email, password, role });
    return user;
  }

  async delete(id) {
    const user = await UserMapping.findByPk(id);
    if (!user) {
      throw new Error("Пользователь не найден в БД");
    }
    await user.destroy();
    return user;
  }

  // ! дописать cntrl,services для login и signup
  // async login(email) {
  //   console.log("SRV.serv.User login ", 1);
  //   const user = await UserMapping.findOne({ where: { email } });
  //   console.log("SRV.serv.User login user ", user);
  //   if (!user) {
  //     throw new Error("Пользователь не найден в БД");
  //   }
  //   return user;
  // }
}

export default new User();
