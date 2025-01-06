// подкл. библ. для шифрование пароля нов.польз.
const bcrypt = require('bcryptjs');
// подкл.генир.уник.рандом.id
const uuid = require('uuid');

// модель данных табл.User
import { UserModel } from '../models/model';
import { UserRoleModel } from '../models/model';
// serv разные
import BasketService from './basket.service';
import TokenService from './token.service';
import MailService from './mail.service';
import RoleService from './role.service';
// утилиты/helpы/обраб.ошб./dto
import AppError from '../middleware/errors/ApiError';
import UserDto from '../dtos/user.dto';
import TokenDto from '../dtos/token.dto';
import DatabaseUtils from '../utils/database.utils';
import { UserAttributes, UserCreationAttributes } from 'models/sequelize-types';
import { Model } from 'sequelize';

// перем.степень шифр.
const hashSync = 5;

class UserService {
  // любой Пользователь
  // РЕГИСТРАЦИЯ
  async signupUser(email: string, password: string, role: string = 'USER') {
    try {
      const eml = await UserModel.findOne({ where: { email } });
      if (eml) {
        throw AppError.badRequest(
          'НЕ удалось зарегистрироваться',
          `Пользователь с Email <${email}> уже существует`,
        );
      }

      // hashирование(не шифрование) пароля ч/з bcryptjs. 1ый пароль, 2ой степень шифр.
      const hashPassword = await bcrypt.hash(password, hashSync);

      // генер.уник.ссылку активации ч/з fn v4(подтверждение акаунта)
      let activationLink = uuid.v4();
      let activationLinkPath = `${process.env.SRV_URL}/api/user/activate/${activationLink}`;

      // отпр.смс на почту для актив-ии (кому,полн.путь ссылки)
      // ! врем.откл. > ошб. - Invalid login: 535-5.7.8 Username and Password not accepted | 535 5.7.8 Error: authentication failed: Invalid user or password ~~ настр.доступ.почт
      // const mail = await MailService.sendActionMail(email, activationLinkPath);
      // if (!mail || mail.errors) {
      //   console.log("U.serv mail.errors : ", mail.errors);
      //   const errorMessage = mail.message.split("\n")[0];
      //   return AppError.badRequest(errorMessage, mail.errors);
      // }

      // `получить наименьший доступный идентификатор` из табл.БД
      const smallestFreeId = await DatabaseUtils.getSmallestIDAvailable('user');

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
      const userRoles = await RoleService.assignUserRole(
        user.getDataValue('id') /* id */ /* get('id') */,
        role,
      );
      if (!userRoles || userRoles === null) {
        throw AppError.badRequest('НЕ удалось записать Роль');
      }

      // опред.Роли User
      let roleUs: string = '';
      if (userRoles.getDataValue('roleId') === 1) {
        roleUs = 'USER';
      }

      // объ.перед.данн.> Роли > id/email/username/role/level
      // const { id, username } = user.get();
      const tokenDto = new TokenDto({
        id: user.getDataValue('id'),
        email,
        username: user.getDataValue('username'),
        role: roleUs,
        level: userRoles.getDataValue('level'),
        // level: userRoles.level,
      });

      // созд./получ. 2 токена. email/role
      const tokens = TokenService.generateToken({ ...tokenDto });

      // созд.Корзину по User.id
      const basket = await BasketService.createBasket(user.getDataValue('id'));

      // сохр.refresh в БД
      await TokenService.saveToken(
        user.getDataValue('id'),
        basket.id,
        tokens.refreshToken,
      );

      // возвращ.tokens/basket.id
      return { tokens: tokens, basketId: basket.id };
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Не удалось зарегистрироваться`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  // АВТОРИЗАЦИЯ
  async loginUser(email: string, password: string) {
    try {
      // проверка сущест. eml (позже username)
      const user = await UserModel.findOne({ where: { email } });
      if (!user) {
        throw AppError.badRequest(`Пользователь с Email <${email}> не найден`);
      }
      // `сравнивания` пароля с шифрованым
      let comparePassword = bcrypt.compareSync(
        password,
        user.getDataValue('password'),
      );
      if (!comparePassword) {
        throw AppError.badRequest('Указан неверный пароль');
      }

      // провер.существ.Роли пользователя
      const userRoles = await RoleService.getOneUserRole(
        user.getDataValue('id'),
        'user',
      );
      if (!userRoles || userRoles === null) {
        throw AppError.badRequest('НЕ удалось записать Роль');
      }

      // опред.Роли User
      let roleUs: string = '';
      if (userRoles.get('roleId') === 1) {
        roleUs = 'USER';
      } else if (userRoles.get('roleId') === 2) {
        roleUs = 'ADMIN';
      } else if (!userRoles || userRoles === null) {
        // привязка.существ.Роли пользователя
        await RoleService.assignUserRole(user.getDataValue('id'), 'USER');
        roleUs = 'USER';
      }

      // объ.перед.данн.> Роли > id/email/username/role/level
      const tokenDto = new TokenDto({
        id: user.getDataValue('id'),
        email,
        username: user.getDataValue('username'),
        role: roleUs,
        level: userRoles.get('level'),
      });
      // созд./получ. 2 токена. email/role
      const tokens = TokenService.generateToken({ ...tokenDto });

      // получ.basket_id
      const basketId = await BasketService.getOneBasket(
        null,
        user.getDataValue('id'),
      );

      // сохр.refreshToken > user_id и basket_id
      await TokenService.saveToken(
        user.getDataValue('id'),
        basketId,
        tokens.refreshToken,
      );

      return {
        // message: `Зашёл ${user.username} <${email}>. ID_${user.id}_${roleUs}`,
        tokens: tokens,
        basketId: basketId,
        activated: user.getDataValue('isActivated'),
      };
    } catch (error: unknown) {
      return AppError.badRequest(
        `Не удалось авторизоваться`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  // USER Пользователь
  // АКТИВАЦИЯ АКАУНТА. приним.ссылку актив.us из БД
  async activateUser(activationLink: string) {
    const user = await UserModel.findOne({
      where: { activationLink: activationLink },
    });
    if (!user) {
      throw AppError.badRequest(`Некорр ссы.актив. Пользователя НЕТ`);
    }
    // флаг в true и сохр.
    user.set('isActivated', true);
    user.save();
  }
  // ПЕРЕЗАПИСЬ ACCESS|REFRESH токен. Отправ.refresh, получ.access и refresh
  async refreshUser(refreshToken: string) {
    try {
      // е/и нет то ошб.не авториз
      if (!refreshToken) {
        return AppError.unauthorized('Требуется авторизация');
      }

      // валид.токен.refresh
      const userData = TokenService.validateRefreshToken(refreshToken);
      // поиск токена
      const tokenFromDB = await TokenService.findToken(refreshToken);

      // проверка валид и поиск
      if (!userData || !tokenFromDB) {
        return AppError.unauthorized('Токен  отсутствует');
      }

      // вытаск.польз.с БД по ID
      const user = await UserModel.findByPk(userData.id);
      if (!user) {
        return AppError.unauthorized('Пользователь отсутствует');
      }

      // провер.существ.Роли пользователя
      const userRoles = await RoleService.getOneUserRole(
        user.getDataValue('id'),
        'user',
      );

      // опред.Роли User
      let roleUs: string = '';
      if (userRoles.get('roleId') === 1) {
        roleUs = 'USER';
      }

      // объ.перед.данн.> Роли > id/email/username/role/level
      const tokenDto = new TokenDto({
        id: user.getDataValue('id'),
        email: user.getDataValue('email'),
        username: user.getDataValue('username'),
        role: roleUs,
        level: userRoles.get('level'),
      });

      // созд./получ. 2 токена. email/role
      const tokens = TokenService.generateToken({ ...tokenDto });

      const basketId = await BasketService.getOneBasket(
        null,
        user.getDataValue('id'),
      );

      await TokenService.saveToken(
        user.getDataValue('id'),
        basketId,
        tokens.refreshToken,
      );

      return {
        message: `ПЕРЕЗАПИСЬ ${user.get('username')} <${user.get('email')}>. ID_${user.get('id')}_${roleUs}`,
        tokens: tokens,
      };
    } catch (error: unknown) {
      throw AppError.badRequest(
        `ПЕРЕЗАПИСЬ не прошла`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  // ВЫХОД. Удален.refreshToken из БД ч/з token.serv
  async logoutUser(refreshToken: string, username: string, email: string) {
    try {
      // пров.переданого токена
      if (!refreshToken) {
        // return "Токен не передан";
        throw AppError.badRequest(`Токен от ${username} <${email}> не передан`);
      }
      const token = await TokenService.removeToken(refreshToken);
      return `Токен ${refreshToken} пользователя ${username} <${email}> удалён. Стат ${token}`;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `ВЫХОД не прошёл`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  // ADMIN Пользователь
  async createUser(data: any) {
    try {
      const { email, password, role } = data;
      const check = await UserModel.findOne({ where: { email } });
      if (check)
        /* throw new Error // ! как-то не так отраб.*/
        throw AppError.badRequest('Пользователь уже существует');
      const user = await UserModel.create({ email, password, role });
      // созд.Корзину по User.id
      if (user.get('id')) await BasketService.createBasket(user.get('id'));
      return user;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `ADMIN createUser не прошёл`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  async getOneUser(
    id: number,
  ): Promise<Model<UserAttributes, UserCreationAttributes> | null> {
    try {
      const user = await UserModel.findByPk(id);
      if (!user) {
        throw AppError.notFound(`Пользователь по id ${id} не найден в БД`);
      }
      return user;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Корзина не получена`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  async getAllUser() {
    try {
      const users = await UserModel.findAll();
      return users;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `ADMIN createUser не прошёл`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  async updateUser(id: number, data: any) {
    try {
      const user = await UserModel.findByPk(id /* , { raw: true } */);
      if (!user)
        return AppError.notFound(`Пользователь по id ${id} не найден в БД`);
      const {
        email = user./* email */ get('email'),
        password = user./* password */ get('password'),
        // ! заменить на роль из UserRoles
        role = user./* role */ get('role'),
      } = data;
      await user.update({ email, password });

      if (data.role) {
        await UserRoleModel.update(
          { roleId: data.role },
          { where: { userId: id } },
        );
      }

      return user;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `ADMIN createUser не прошёл`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  async deleteUser(id: number) {
    try {
      const user = await UserModel.findByPk(id);
      if (!user) return AppError.badRequest('Пользователь не найден в БД');
      if (user.get('id')) BasketService.deleteBasket(user.get('id') as number);
      await user.destroy();
      return user;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `ADMIN createUser не прошёл`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  // поиск по email
  async getByEmailUser(email: string) {
    try {
      const user = await UserModel.findOne({ where: { email } });
      if (!user)
        throw AppError.badRequest(
          `Пользователь с email ${email} не найден в БД`,
        );
      return user;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `ADMIN createUser не прошёл`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
}

export default new UserService();
