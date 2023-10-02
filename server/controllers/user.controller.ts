import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// подкл. валидацию
const { validationResult } = require("express-validator");

import AppError from "../error/ApiError";
import UserService from "../services/user.service";

// расшафр.пароля
const makeJwt = (id, username, email, role) => {
  return jwt.sign(
    { id, username, email, role },
    process.env.JWT_ACCESS_SECRET_KEY,
    { expiresIn: "24h" }
  );
};

// перем.cookie. // ^ domain - управ.поддомен.использования, path - маршр.действ., maxAge - вр.жизни, secure - только по HTTPS, httpOnly - измен.ток.ч/з SRV, signed - подписан
const maxAge1 = 60 * 60 * 1000 * 24 * 30;
const maxAge2 = 60 * 60 * 1000 * 24 * 365; // вр.жизни один год
const signed = true;
const httpOnly = true;

class User {
  // РЕГИСТРАЦИЯ
  async signupUser(req, res, next) {
    try {
      // проверка вход.полей на валидацию. шаблоны в route
      const errorsValid = validationResult(req);
      // е/и проверка не прошла(не пусто) - возвращ.Ответ на front смс ошб.(кастомизируем) + errors
      if (!errorsValid.isEmpty()) {
        return next(
          AppError.badRequest(
            "Некорректые данные при Регистрации",
            errorsValid.array()
          )
        );
      }

      // Получ.данн.из тела запроса
      const { email, password, role = "USER" } = req.body;

      // проверка отсутств.user/password
      if (!email) throw next(AppError.badRequest("Пустой email"));
      if (!password) throw next(AppError.badRequest("Пустой пароль"));

      // передача данн.в fn для Service (возвращ.data - ссыл.актив, 2 токена, данн.польз., смс)
      const userData = await UserService.signupUser(email, password);
      // обраб.ошб.
      if ("errors" in userData) {
        return next(AppError.badRequest(userData.message, userData.errors));
      }

      // сохр.refreshToken в cookie
      if ("tokens" in userData) {
        const usTokRef = userData.tokens.refreshToken;
        res
          .cookie("refreshToken", usTokRef, { maxAge1, httpOnly })
          .cookie("basketId", userData.basketId, { maxAge2, signed });
      }

      return res.json(userData);
    } catch (error) {
      return next(AppError.badRequest(error.message));
    }
  }

  // АВТОРИЗАЦИЯ
  async loginUser(req, res, next) {
    try {
      // проверка вход.полей на валидацию. шаблоны в route
      const errorsValid = validationResult(req);
      if (!errorsValid.isEmpty()) {
        return next(
          AppError.badRequest("Некорректый Вход", errorsValid.array())
        );
      }

      const { email, password } = req.body;

      const userData = await UserService.loginUser(email, password);
      if ("errors" in userData) {
        return next(AppError.badRequest(userData.message, userData.errors));
      }

      if ("tokens" in userData) {
        const usTokRef = userData.tokens.refreshToken;
        res
          .cookie("refreshToken", usTokRef, { maxAge1, httpOnly })
          .cookie("basketId", userData.basketId, { maxAge2, signed });
      }

      return res.json(userData);
    } catch (error) {
      next(AppError.badRequest(error.message));
    }
  }

  // ВЫХОД. Удал.Cookie.refreshToken
  async logout(req, res, next) {
    try {
      // получ refresh из cookie, передача в service, удал.обоих, возвращ.смс об удален.
      const { refreshToken } = req.cookies;
      const { username, email } = req.body;

      const token = await UserService.logoutUser(refreshToken, username, email);

      res.clearCookie("refreshToken");

      return res.json(token);
    } catch (error) {
      next(AppError.badRequest(error.message));
    }
  }

  // проверка Польз.
  async checkUser(req, res, next) {
    const token = makeJwt(
      req.auth.id,
      req.auth.username,
      req.auth.email,
      req.auth.role
    );
    return res.json({ token });
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

      return res.json(user);
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
  async getAllUser(req, res, next) {
    try {
      const users = await UserService.getAllUser();
      res.json(users);
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
