import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import AppError from "../error/ApiError";
import UserService from "../services/user.service";
// подкл. валидацию
const { validationResult } = require("express-validator");

const makeJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class User {
  // РЕГИСТРАЦИЯ
  async signupUser(req, res, next) {
    try {
      // проверка вход.полей на валидацию. шаблоны в route
      const errorsValid = validationResult(req);
      // е/и проверка не прошла(не пусто) - возвращ.Ответ на front смс ошб.(кастомизируем) + errors.масс.
      if (!errorsValid.isEmpty()) {
        // throw new Error( // ! ошб.
        // throw next(AppError.badRequest(
        // return AppError.badRequest( // ? нет вывода на Front
        return next(
          AppError.badRequest(
            // {message: "смс",errors: errorsValid.array()} // ! при передаче объ.не подтягивается errors
            "Некорректые данные при Регистрации",
            errorsValid.array()
          )
        );
      }

      const { email, password, role = "USER" } = req.body;

      if (!email || !password) {
        throw new Error("Пустой email или пароль");
      }
      // if (role !== "USER") {
      //   throw new Error("Возможна только роль USER");
      // }
      const hash = await bcrypt.hash(password, 5);
      const user = await UserService.createUser({
        email,
        password: hash,
        role,
      });
      const token = makeJwt(user.id, user.email, user.role);
      // // созд.Корзину по User.id
      // if (user.id) {
      //   await BasketService.createBasket(user.id);
      // }
      return res.json({ token });
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  // АВТОРИЗАЦИЯ
  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserService.getByEmailUser(email);
      // `сравнение` паролей
      let compare = bcrypt.compareSync(password, user.password);
      if (!compare) {
        throw new Error("Указан неверный пароль");
      }
      const token = makeJwt(user.id, user.email, user.role);
      return res.json({ token });
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async checkUser(req, res, next) {
    const token = makeJwt(req.auth.id, req.auth.email, req.auth.role);
    return res.json({ token });
  }

  async getAllUser(req, res, next) {
    try {
      const users = await UserService.getAllUser();
      res.json(users);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOneUser(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id пользователя");
      }
      const user = await UserService.getOneUser(req.params.id);
      res.json(user);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  // пока отд.нет
  async createUser(req, res, next) {
    const { email, password, role = "USER" } = req.body;
    try {
      if (!email || !password) {
        throw new Error("Пустой email или пароль");
      }
      if (!["USER", "ADMIN"].includes(role)) {
        throw new Error("Недопустимое значение роли");
      }
      const hash = await bcrypt.hash(password, 5);
      const user = await UserService.createUser({
        email,
        password: hash,
        role,
      });
      // // созд.Корзину по User.id
      // if (user.id) {
      //   await BasketService.createBasket(user.id);
      // }
      return res.json(user);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async updateUser(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id пользователя");
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error("Нет данных для обновления");
      }
      let { email, password, role } = req.body;
      if (role && !["USER", "ADMIN"].includes(role)) {
        throw new Error("Недопустимое значение роли");
      }
      if (password) {
        password = await bcrypt.hash(password, 5);
      }
      const user = await UserService.updateUser(req.params.id, {
        email,
        password,
        role,
      });
      res.json(user);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async deleteUser(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id пользователя");
      }
      const user = await UserService.deleteUser(req.params.id);
      res.json(user);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new User();
