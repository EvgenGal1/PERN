// подкл. библ. для шифрование пароля нов.польз.
const bcrypt = require("bcryptjs");
// подкл.генир.уник.рандом.id
const uuid = require("uuid");

// обраб.ошб.
import AppError from "../error/ApiError";
// выборка полей
import UserDto from "../dtos/user.dto";
import { User as UserModel } from "../models/model";
// serv разные
import BasketService from "../services/basket.service";
import TokenService from "../services/token.service";
import MailService from "../services/mail.service";

// перем.степень шифр.
const hashSync = 5;

class UserService {
  // любой Пользователь
  // РЕГИСТРАЦИЯ
  async signupUser(email: string, password: string) {
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

      // СОЗД.НОВ.ПОЛЬЗОВАТЕЛЯ (пароль шифр.)
      const user = await UserModel.create({
        email,
        password: hashPassword,
        activationLink,
      });

      // отпр.смс на почту для актив-ии (кому,полн.путь ссылки)
      await MailService.sendActionMail(email, activationLinkPath);

      // выборка полей(~3шт.) для FRONT (new - созд.экземпляр класса)
      const userDto = new UserDto(user);

      // созд./получ. 2 токена. Разворач.нов.объ.
      const tokens = TokenService.generateToken({ ...userDto });

      // созд.Корзину по User.id
      const basket = await BasketService.createBasket(user.id);

      // сохр.refresh в БД
      await TokenService.saveToken(userDto.id, basket.id, tokens.refreshToken);

      // возвращ.data - ссыл.актив, 2 токена(с данн.польз.), смс, id basket
      // const dataServ = {
      // activationLinkPath,
      // message: `Пользователь c <${email}> создан и зарегистрирован. ID_${user.id}_${user.role}`,
      //   tokens: tokens,
      //   basketId: basket.id,
      // };
      // return dataServ;
      return { tokens: tokens, basketId: basket.id };
    } catch (error) {
      return AppError.badRequest(
        `НЕ SRV ERR удалось зарегистрироваться`,
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

      // проверка `сравнивания` пароля с шифрованым
      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return AppError.badRequest("Указан неверный пароль");
      }

      const userDto = new UserDto(user);

      const tokens = TokenService.generateToken({ ...userDto });

      // ! костыль 1.1. получ./созд. basket по userId
      const userId = userDto.id;
      const basket = await BasketService.getOneBasket(null, userId);

      await TokenService.saveToken(userDto.id, basket.id, tokens.refreshToken);

      return {
        // message: `Зашёл ${user.username} <${email}>. ID_${user.id}_${user.role}`,
        tokens: tokens,
        basketId: basket.id,
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

      const userDto = new UserDto(user);

      const tokens = TokenService.generateToken({ ...userDto });

      const basket = await BasketService.getOneBasket(userDto.id);

      await TokenService.saveToken(userDto.id, basket.id, tokens.refreshToken);

      return {
        message: `ПЕРЕЗАПИСЬ ${userDto.username} <${userDto.email}>. ID_${user.id}_${user.role}`,
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
      if (check) throw new Error("Пользователь уже существует");
      const user = await UserModel.create({ email, password, role });
      // созд.Корзину по User.id
      if (user.id) await BasketService.createBasket(user.id);
      return user;
    } catch (error) {
      return AppError.badRequest(`ADMIN createUser не прошёл`, error.message);
    }
  }
  async getOneUser(id: number) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error(`Пользователь по id ${id} не найден в БД`);
    return user;
  }
  async getAllUser() {
    const users = await UserModel.findAll();
    return users;
  }
  async updateUser(id: number, data) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Пользователь не найден в БД");
    const {
      email = user.email,
      password = user.password,
      role = user.role,
    } = data;
    await user.update({ email, password, role });
    return user;
  }
  async deleteUser(id: number) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Пользователь не найден в БД");
    if (user.id) BasketService.deleteBasket(user.id);
    await user.destroy();
    return user;
  }
  // поиск по email
  async getByEmailUser(email: string) {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new Error(`Пользователь с email ${email} не найден в БД`);
    return user;
  }
}

export default new UserService();
