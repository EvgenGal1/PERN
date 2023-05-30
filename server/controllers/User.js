import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../services/User.js";
import AppError from "../error/AppError_Tok.js";

// ! дописать cntrl,services для login и signup
// import { User as UserMapping } from "../models/mapping.js";

const makeJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class User {
  // Регистрация
  async signup(req, res, next) {
    const { email, password, role = "USER" } = req.body;
    try {
      if (!email || !password) {
        throw new Error("Пустой email или пароль");
      }
      if (role !== "USER") {
        throw new Error("Возможна только роль USER");
      }
      const hash = await bcrypt.hash(password, 5);
      const user = await UserModel.create({ email, password: hash, role });
      const token = makeJwt(user.id, user.email, user.role);
      return res.json({ token });
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  // Вход
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.getByEmail(email);
      // ! дописать cntrl,services для login и signup
      // const user = await UserModel.login(email /* , password */);
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

  async check(req, res, next) {
    const token = makeJwt(req.auth.id, req.auth.email, req.auth.role);
    return res.json({ token });
  }

  async getAll(req, res, next) {
    try {
      const users = await UserModel.getAll();
      res.json(users);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id пользователя");
      }
      const user = await UserModel.getOne(req.params.id);
      res.json(user);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    const { email, password, role = "USER" } = req.body;
    try {
      if (!email || !password) {
        throw new Error("Пустой email или пароль");
      }
      if (!["USER", "ADMIN"].includes(role)) {
        throw new Error("Недопустимое значение роли");
      }
      const hash = await bcrypt.hash(password, 5);
      const user = await UserModel.create({ email, password: hash, role });
      return res.json(user);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
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
      const user = await UserModel.update(req.params.id, {
        email,
        password,
        role,
      });
      res.json(user);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id пользователя");
      }
      const user = await UserModel.delete(req.params.id);
      res.json(user);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new User();
