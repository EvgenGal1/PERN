// подкл. валидацию
const { validationResult } = require('express-validator');

// модели данных табл.
import { User as UserModel } from '../models/model';
// services
import UserService from '../services/user.service';
import TokenService from '../services/token.service';
import RoleService from '../services/role.service';
// обраб.ошб.
import AppError from '../error/ApiError';
// выборка полей
import UserDto from '../dtos/user.dto';
import TokenDto from '../dtos/token.dto';

// перем.cookie. // ^ domain - управ.поддомен.использования, path - маршр.действ., maxAge - вр.жизни, secure - только по HTTPS, httpOnly - измен.ток.ч/з SRV, signed - подписан
const maxAge1 = 60 * 60 * 1000 * 24 * 30; // вр.жизни 1 месяц
const maxAge2 = 60 * 60 * 1000 * 24 * 365; // вр.жизни один год
const signed = true;
const httpOnly = true;

class UserController {
  // любой Пользователь
  // РЕГИСТРАЦИЯ
  async signupUser(req, res, next) {
    try {
      // проверка вход.полей на валидацию. шаблоны в route
      const errorsValid = validationResult(req);
      // е/и проверка не прошла(не пусто) - возвращ.Ответ на front смс ошб.(кастомизируем) + errors
      if (!errorsValid.isEmpty()) {
        return next(
          AppError.badRequest(
            'Некорректые данные при Регистрации',
            errorsValid.array(),
          ),
        );
      }

      // Получ.данн.из тела запроса
      const { email, password, role = 'USER' } = req.body;

      // проверка отсутств.user/password
      if (!email) return next(AppError.badRequest('Пустой email'));
      if (!password) return next(AppError.badRequest('Пустой пароль'));

      // передача данн.в fn для Service (возвращ.data - ссыл.актив, 2 токена, данн.польз., смс)
      const userData = await UserService.signupUser(email, password, role);
      // обраб.ошб.
      if ('errors' in userData) {
        const user = await UserModel.findOne({ where: { email } });
        if (user) {
          await UserService.deleteUser(user.id);
        }
        return next(AppError.badRequest(userData.message, userData.errors));
      }

      // сохр.refreshToken/basketId в cookie и возвращ. access
      let tokens: string = '';
      if ('tokens' in userData) {
        const usTokRef = userData.tokens.refreshToken;
        res
          .cookie('refreshToken', usTokRef, { maxAge1, httpOnly })
          .cookie('basketId', userData.basketId, { maxAge2, signed });
        tokens = userData.tokens.accessToken;
      }

      // return res.json(userData);
      // возвращ. accessToken
      const data = { tokens };
      return res.json(data);
    } catch (error: unknown) {
      const { email } = req.body;
      const user = await UserModel.findOne({ where: { email } });
      if (user) {
        await UserService.deleteUser(user.id);
      }
      return next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
  // АВТОРИЗАЦИЯ
  async loginUser(req, res, next) {
    try {
      // проверка вход.полей на валидацию. шаблоны в route
      const errorsValid = validationResult(req);
      if (!errorsValid.isEmpty()) {
        return next(
          AppError.badRequest('Некорректый Вход', errorsValid.array()),
        );
      }

      const { email, password } = req.body;

      const userData = await UserService.loginUser(email, password);
      if ('errors' in userData) {
        return next(AppError.badRequest(userData.message, userData.errors));
      }

      // сохр.refreshToken/basketId в cookie и возвращ. access и сост.активации
      let tokens: string = '';
      let activated: boolean = false;
      if ('tokens' in userData) {
        const usTokRef = userData.tokens.refreshToken;
        res
          .cookie('refreshToken', usTokRef, { maxAge1, httpOnly })
          .cookie('basketId', userData.basketId, { maxAge2, signed });
        tokens = userData.tokens.accessToken;
        activated = userData.activated;
      }

      // return res.json(userData);
      // возвращ. accessToken и activated(сост.активации)
      const data = { tokens, activated };
      return res.json(data);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // USER Пользователь
  // АКТИВАЦИЯ АКАУНТА. По ссылке в почту
  async activateUser(req, res, next) {
    try {
      // из стр.получ.ссы.актив.
      const activationLink = req.params.link;
      await UserService.activateUser(activationLink);
      // перенаправить на FRONT после перехода по ссылки
      return res.redirect(`${process.env.CLT_URL}/user`);
    } catch (error) {
      return next(AppError.badRequest(`НЕ удалось АКТИВАВИРАВАТЬ - ${error}.`));
    }
  }
  // ПЕРЕЗАПИСЬ ACCESS токен. Отправ.refresh, получ.access и refresh
  async refreshUser(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      // const { username, email } = req.body;
      const userData = await UserService.refreshUser(
        refreshToken /* , username, email */,
      );
      if ('tokens' in userData) {
        const usTokRef = userData.tokens.refreshToken;
        res.cookie('refreshToken', usTokRef, { maxAge1, httpOnly });
      }
      // return res.json(username, email);
      return res.json(userData /* , username, email */);
    } catch (error) {
      return next(AppError.badRequest(`НЕ удалось ПЕРЕЗАПИСАТЬ - ${error}.`));
    }
  }
  // ПРОВЕРКА. Польз.
  async checkUser(req, res, next) {
    const user = await UserService.getOneUser(req.auth.id);
    const activated = user.isActivated;

    // провер.существ.Роли пользователя
    const userRoles = await RoleService.getOneUserRole(user.id, 'user');
    // опред.Роли User
    let roleUs: string = '';
    if (userRoles.roleId === 1) {
      roleUs = 'USER';
    } else if (userRoles.roleId === 2) {
      roleUs = 'ADMIN';
    } else if (!userRoles || userRoles === null || userRoles.errors) {
      // привязка.существ.Роли пользователя
      await RoleService.assignUserRole(user.id, 'USER');
      roleUs = 'USER';
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
    const token = tokens.accessToken;

    return res.json({ token, activated });
  }
  // ВЫХОД. Удал.Cookie.refreshToken
  async logoutUser(req, res, next) {
    try {
      // получ refresh из cookie, передача в service, удал.обоих, возвращ.смс об удален.
      const { refreshToken } = req.cookies;
      const { username, email } = req.body;

      const token = await UserService.logoutUser(refreshToken, username, email);

      res.clearCookie('refreshToken');

      return res.json(token);
    } catch (error: unknown) {
      return next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  // ADMIN Пользователь
  // пока отд.нет
  async createUser(req, res, next) {
    const { email, password, role = 'USER' } = req.body;
    try {
      if (!email || !password) {
        throw new Error('Пустой email или пароль');
      }
      if (!['USER', 'ADMIN'].includes(role)) {
        throw new Error('Недопустимое значение роли');
      }

      // const hash = await bcrypt.hash(password, 5);
      const user = await UserService.createUser({
        email,
        // password: hash,
        password,
        role,
      });

      return res.json(user);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
  async getOneUser(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id пользователя');
      }
      const user = await UserService.getOneUser(req.params.id);
      if (!user) {
        // Если служба возвращает null, значит, пользователь не найден, устанавливаем статус 404.
        return next(
          AppError.notFound(
            `Пользователь по id ${req.params.id} не найден в БД`,
          ),
        );
      }
      return res.json(user);
    } catch (error: unknown) {
      return next(
        AppError.internalServerError('Ошибка при получении пользователя'),
      );

      // next(AppError.badRequest((error as Error).message));

      // return AppError.badRequest(
      //   `ADMIN createUser не прошёл`,
      //   error instanceof Error ? error?.message : 'Неизвестная ошибка',
      // );

      // next(
      //   error instanceof AppError
      //     ? error
      //     : AppError.badRequest((error as Error).message),
      // );
    }
  }
  async getAllUser(req, res, next) {
    try {
      const users = await UserService.getAllUser();
      res.json(users);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
  async updateUser(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id пользователя');
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для обновления');
      }
      let { email, password, role } = req.body;
      if (role && !['USER', 'ADMIN'].includes(role)) {
        throw new Error('Недопустимое значение роли');
      }
      // if (password) {
      //   password = await bcrypt.hash(password, 5);
      // }
      const user = await UserService.updateUser(req.params.id, {
        email,
        password,
        role,
      });
      res.json(user);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
  async deleteUser(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id пользователя');
      }
      const user = await UserService.deleteUser(req.params.id);
      res.json(user);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
}

export default new UserController();
