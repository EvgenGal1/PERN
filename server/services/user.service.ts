// подкл. библ. для шифрование пароля нов.польз.
const bcrypt = require("bcryptjs");
// подкл.генир.уник.рандом.id
const uuid = require("uuid");

// модель данных табл.User
import { User as UserModel } from "../models/model";
// serv разные
import BasketService from "../services/basket.service";
import TokenService from "../services/token.service";
import MailService from "../services/mail.service";
import RoleService from "../services/role.service";
// утилиты/helpы/обраб.ошб./dto
import AppError from "../error/ApiError";
import UserDto from "../dtos/user.dto";
import TokenDto from "../dtos/token.dto";
import DatabaseUtils from "../utils/database.utils";

// перем.степень шифр.
const hashSync = 5;

class UserService {
  // любой Пользователь
  // РЕГИСТРАЦИЯ
  async signupUser(email: string, password: string, role: string = "USER") {
    try {
      const eml = await UserModel.findOne({ where: { email } });
      if (eml) {
        return AppError.badRequest(
          "НЕ удалось зарегистрироваться",
          `Пользователь с Email <${email}> уже существует`
        );
      }

      // hashирование(не шифрование) пароля ч/з bcryptjs. 1ый пароль, 2ой степень шифр.
      const hashPassword = await bcrypt.hash(password, hashSync);

      // генер.уник.ссылку активации ч/з fn v4(подтверждение акаунта)
      let activationLink = uuid.v4();
      let activationLinkPath = `${process.env.API_URL_CLN}/api/user/activate/${activationLink}`;

      // отпр.смс на почту для актив-ии (кому,полн.путь ссылки)
      // ! врем.откл. > ошб. - Invalid login: 535-5.7.8 Username and Password not accepted | 535 5.7.8 Error: authentication failed: Invalid user or password ~~ настр.доступ.почт
      // const mail = await MailService.sendActionMail(email, activationLinkPath);
      // if (!mail || mail.errors) {
      //   console.log("U.serv mail.errors : ", mail.errors);
      //   const errorMessage = mail.message.split("\n")[0];
      //   return AppError.badRequest(errorMessage, mail.errors);
      // }

      // `получить наименьший доступный идентификатор` из табл.БД
      const smallestFreeId = await DatabaseUtils.getSmallestIDAvailable("user");

      // объ.перед.данн.>id/username/email/role
      const userDto = new UserDto({
        id: smallestFreeId,
        email,
        role,
      });

      // СОЗД.НОВ.ПОЛЬЗОВАТЕЛЯ (пароль шифр.)
      const user = await UserModel.create({
        ...userDto,
        password: hashPassword,
        activationLink,
      });

      // привязка.существ.Роли пользователя
      const userRoles = await RoleService.assignUserRole(user.id, role);
      if (!userRoles || userRoles === null || userRoles.errors) {
        return AppError.badRequest("НЕ удалось записать Роль");
      }

      // опред.Роли User
      let roleUs: string;
      if (userRoles.roleId === 1) {
        roleUs = "USER";
      }

      // объ.перед.данн.> Роли > id/email/username/role/level
      const tokenDto = new TokenDto({
        id: user.id,
        email,
        username: user.username,
        role: roleUs,
        level: userRoles.level,
      });

      // созд./получ. 2 токена. email/role
      const tokens = TokenService.generateToken({ ...tokenDto });

      // созд.Корзину по User.id
      const basket = await BasketService.createBasket(user.id);

      // сохр.refresh в БД
      await TokenService.saveToken(user.id, basket.id, tokens.refreshToken);

      // возвращ.tokens/basket.id
      return { tokens: tokens, basketId: basket.id };
    } catch (error) {
      return AppError.badRequest(
        `Не удалось зарегистрироваться`,
        error.message
      );
    }
  }
  // АВТОРИЗАЦИЯ
  async loginUser(email: string, password: string) {
    try {
      // проверка сущест. eml (позже username)
      const user = await UserModel.findOne({ where: { email } });
      if (!user) {
        return AppError.badRequest(`Пользователь с Email <${email}> не найден`);
      }
      // `сравнивания` пароля с шифрованым
      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return AppError.badRequest("Указан неверный пароль");
      }

      // провер.существ.Роли пользователя
      const userRoles = await RoleService.getOneUserRole(user.id, "user");
      if (!userRoles || userRoles === null || userRoles.errors) {
        return AppError.badRequest("НЕ удалось записать Роль");
      }

      // опред.Роли User
      let roleUs: string;
      if (userRoles.roleId === 1) {
        roleUs = "USER";
      } else if (userRoles.roleId === 2) {
        roleUs = "ADMIN";
      } else if (!userRoles || userRoles === null || userRoles.errors) {
        // привязка.существ.Роли пользователя
        await RoleService.assignUserRole(user.id, "USER");
        roleUs = "USER";
      }

      // объ.перед.данн.> Роли > id/email/username/role/level
      const tokenDto = new TokenDto({
        id: user.id,
        email,
        username: user.username,
        role: roleUs,
        level: userRoles.level,
      });
      // созд./получ. 2 токена. email/role
      const tokens = TokenService.generateToken({ ...tokenDto });

      // получ.basket_id
      const basketId = await BasketService.getOneBasket(null, user.id);

      // сохр.refreshToken > user_id и basket_id
      await TokenService.saveToken(user.id, basketId, tokens.refreshToken);

      return {
        // message: `Зашёл ${user.username} <${email}>. ID_${user.id}_${roleUs}`,
        tokens: tokens,
        basketId: basketId,
        activated: user.isActivated,
      };
    } catch (error) {
      return AppError.badRequest(`НЕ удалось войти - ${error}.`);
    }
  }

  // USER Пользователь
  // АКТИВАЦИЯ АКАУНТА. приним.ссылку актив.us из БД
  async activateUser(activationLink: string) {
    const user = await UserModel.findOne({
      where: { activationLink: activationLink },
    });
    if (!user) {
      return AppError.badRequest(`Некорр ссы.актив. Пользователя НЕТ`);
    }
    // флаг в true и сохр.
    user.isActivated = true;
    user.save();
  }
  // ПЕРЕЗАПИСЬ ACCESS|REFRESH токен. Отправ.refresh, получ.access и refresh
  async refreshUser(refreshToken: string) {
    try {
      // е/и нет то ошб.не авториз
      if (!refreshToken) {
        return AppError.unauthorizedError("Требуется авторизация");
      }

      // валид.токен.refresh
      const userData = TokenService.validateRefreshToken(refreshToken);
      // поиск токена
      const tokenFromDB = await TokenService.findToken(refreshToken);

      // проверка валид и поиск
      if (!userData || !tokenFromDB) {
        return AppError.unauthorizedError("Токен  отсутствует");
      }

      // вытаск.польз.с БД по ID
      const user = await UserModel.findByPk(userData.id);

      // провер.существ.Роли пользователя
      const userRoles = await RoleService.getOneUserRole(user.id, "user");

      // опред.Роли User
      let roleUs: string;
      if (userRoles.roleId === 1) {
        roleUs = "USER";
      }

      // объ.перед.данн.> Роли > id/email/username/role/level
      const tokenDto = new TokenDto({
        id: user.id,
        email: user.email,
        username: user.username,
        role: roleUs,
        level: userRoles.level,
      });

      // созд./получ. 2 токена. email/role
      const tokens = TokenService.generateToken({ ...tokenDto });

      const basketId = await BasketService.getOneBasket(null, user.id);

      await TokenService.saveToken(user.id, basketId, tokens.refreshToken);

      return {
        message: `ПЕРЕЗАПИСЬ ${user.username} <${user.email}>. ID_${user.id}_${roleUs}`,
        tokens: tokens,
      };
    } catch (error) {
      return AppError.badRequest(`ПЕРЕЗАПИСЬ не прошла`, error.message);
    }
  }
  // ВЫХОД. Удален.refreshToken из БД ч/з token.serv
  async logoutUser(refreshToken: string, username: string, email: string) {
    try {
      // пров.переданого токена
      if (!refreshToken) {
        // return "Токен не передан";
        return AppError.badRequest(
          `Токен от ${username} <${email}> не передан`
        );
      }
      const token = await TokenService.removeToken(refreshToken);
      return `Токен ${refreshToken} пользователя ${username} <${email}> удалён. Стат ${token}`;
    } catch (error) {
      return AppError.badRequest(`ВЫХОД не прошёл`, error.message);
    }
  }

  // ADMIN Пользователь
  async createUser(data) {
    try {
      const { email, password, role } = data;
      const check = await UserModel.findOne({ where: { email } });
      if (check)
        /* throw new Error // ! как-то не так отраб.*/
        return AppError.badRequest("Пользователь уже существует");
      const user = await UserModel.create({ email, password, role });
      // созд.Корзину по User.id
      if (user.id) await BasketService.createBasket(user.id);
      return user;
    } catch (error) {
      return AppError.badRequest(`ADMIN createUser не прошёл`, error.message);
    }
  }
  async getOneUser(id: number) {
    try {
      const user = await UserModel.findByPk(id);
      if (!user)
        /* throw new Error // ! как-то не так отраб.*/
        return AppError.badRequest(`Пользователь по id ${id} не найден в БД`);
      return user;
    } catch (error) {
      return AppError.badRequest(`ADMIN createUser не прошёл`, error.message);
    }
  }
  async getAllUser() {
    try {
      const users = await UserModel.findAll();
      return users;
    } catch (error) {
      return AppError.badRequest(`ADMIN createUser не прошёл`, error.message);
    }
  }
  async updateUser(id: number, data) {
    try {
      const user = await UserModel.findByPk(id);
      if (!user) return AppError.badRequest("Пользователь не найден в БД");
      const {
        email = user.email,
        password = user.password,
        // ! заменить на роль из UserRoles
        role = user.role,
      } = data;
      await user.update({ email, password, role });
      return user;
    } catch (error) {
      return AppError.badRequest(`ADMIN createUser не прошёл`, error.message);
    }
  }
  async deleteUser(id: number) {
    try {
      const user = await UserModel.findByPk(id);
      if (!user) return AppError.badRequest("Пользователь не найден в БД");
      if (user.id) BasketService.deleteBasket(user.id);
      await user.destroy();
      return user;
    } catch (error) {
      return AppError.badRequest(`ADMIN createUser не прошёл`, error.message);
    }
  }
  // поиск по email
  async getByEmailUser(email: string) {
    try {
      const user = await UserModel.findOne({ where: { email } });
      if (!user)
        return AppError.badRequest(
          `Пользователь с email ${email} не найден в БД`
        );
      return user;
    } catch (error) {
      return AppError.badRequest(`ADMIN createUser не прошёл`, error.message);
    }
  }
}

export default new UserService();
