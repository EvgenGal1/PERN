import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../services/User.js";
import AppError from "../error/AppError_Tok.js";

// ! дописать cntrl,services для login и signup
import { User as UserMapping } from "../models/mapping.js";

const makeJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class User {
  // Регистрация
  async signup(req, res, next) {
    console.log("SRV.ctrl.User signup ", 1);
    // res.status(200).send("Регистрация пользователя");
    const { email, password, role = "USER" } = req.body;
    try {
      console.log("SRV.ctrl.User signup try ", 2);
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
      console.log("SRV.ctrl.User signup catch ", 2);
      console.log("SRV.ctrl.User signup catch e ", e);
      next(AppError.badRequest(e.message));
    }
  }

  // Вход
  async login(req, res, next) {
    console.log("SRV.ctrl.User login ", 1);
    // res.status(200).send("Вход в личный кабинет");
    try {
      console.log("SRV.ctrl.User login try ", 2);
      const { email, password } = req.body;
      console.log("SRV.ctrl.User login email ", email);
      console.log("SRV.ctrl.User login password ", password);

      // const user = await UserModel.getByEmail(email);
      // ! дописать cntrl,services для login и signup
      const user = await UserModel.login(email /* , password */);
      let compare = bcrypt.compareSync(password, user.password);
      if (!compare) {
        throw new Error("Указан неверный пароль");
      }
      const token = makeJwt(user.id, user.email, user.role);
      return res.json({ token });
    } catch (e) {
      console.log("SRV.ctrl.User login catch ", 2);
      console.log("SRV.ctrl.User login catch e ", e);
      next(AppError.badRequest(e.message));
    }
  }

  async check(req, res, next) {
    res.status(200).send("Проверка авторизации");
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
    try {
      const user = await UserModel.create(req.body);
      res.json(brand);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id пользователя");
      }
      const user = await UserModel.update(req.params.id, req.body);
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
