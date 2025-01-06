// подкл. валидацию
import { validationResult } from 'express-validator';
import { NextFunction } from 'express';

// модели данных табл.
import { UserModel } from '../models/model';
// services
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import TokenService from '../services/token.service';
import RoleService from '../services/role.service';
// обраб.ошб.
import AppError from '../middleware/errors/ApiError';
// выборка полей
import TokenDto from '../dtos/token.dto';

// перем.cookie. // ^ domain - управ.поддомен.использования, path - маршр.действ., maxAge - вр.жизни, secure - только по HTTPS, httpOnly - измен.ток.ч/з SRV, signed - подписан
const maxAge1 = 60 * 60 * 1000 * 24 * 30; // вр.жизни 1 месяц
const maxAge2 = 60 * 60 * 1000 * 24 * 365; // вр.жизни один год
const signed = true;
const httpOnly = true;

class AuthController {
  // любой Пользователь
  // РЕГИСТРАЦИЯ
  async signupUser(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
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
      const userData = await AuthService.signupUser(email, password, role);
      // обраб.ошб.
      if ('errors' in userData) {
        const user = await UserModel.findOne({ where: { email } });
        if (user) {
          await UserService.deleteUser(user.getDataValue('id'));
        }
        if ('message' in userData) {
          return next(
            AppError.badRequest(
              String(userData.message),
              String(userData.errors),
            ),
          );
        }
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
        await UserService.deleteUser(user.getDataValue('id'));
      }
      return next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
  // АВТОРИЗАЦИЯ
  async loginUser(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
    try {
      // проверка вход.полей на валидацию. шаблоны в route
      const errorsValid = validationResult(req);
      if (!errorsValid.isEmpty()) {
        return next(
          AppError.badRequest('Некорректый Вход', errorsValid.array()),
        );
      }

      const { email, password } = req.body;

      const userData = await AuthService.loginUser(email, password);
      // return next(AppError.badRequest(userData.message, userData.errors));
      if ('message' in userData || 'errors' in userData) {
        if (userData instanceof AppError) {
          return next(
            AppError.badRequest(
              String(userData.message),
              String(userData.errors),
            ),
          );
        }
        return next(AppError.badRequest('Unknown error', 'Unknown error'));
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
        activated = userData.activated ?? false;
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
  async activateUser(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
    try {
      // из стр.получ.ссы.актив.
      const activationLink = req.params.link;
      await AuthService.activateUser(activationLink);
      // перенаправить на FRONT после перехода по ссылки
      return res.redirect(`${process.env.CLT_URL}/user`);
    } catch (error) {
      return next(AppError.badRequest(`НЕ удалось АКТИВАВИРАВАТЬ - ${error}.`));
    }
  }
  // ПЕРЕЗАПИСЬ ACCESS токен. Отправ.refresh, получ.access и refresh
  async refreshUser(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
    try {
      const { refreshToken } = req.cookies;
      // const { username, email } = req.body;
      const userData = await AuthService.refreshUser(
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
  async checkUser(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
    const user = await UserService.getOneUser(req.auth.id);
    // провер.существ.Роли пользователя
    if (!user) {
      return next(AppError.badRequest('Пользователь не найден'));
    }
    const activated = user ? user.getDataValue('isActivated') : false;

    const userRoles = await RoleService.getOneUserRole(
      user.getDataValue('id'),
      'user',
    );
    // опред.Роли User
    let roleUs: string = '';
    if (userRoles.get('roleId') === 1) {
      roleUs = 'USER';
    } else if (userRoles.get('roleId') === 2) {
      roleUs = 'ADMIN';
    } else if (!userRoles || userRoles === null || userRoles.get('errors')) {
      // привязка.существ.Роли пользователя
      await RoleService.assignUserRole(user.getDataValue('id'), 'USER');
      roleUs = 'USER';
    }
    // объ.перед.данн.> Роли > id/email/username/role/level
    const tokenDto = new TokenDto({
      id: user.getDataValue('id'),
      email: user.getDataValue('email'),
      username: user.getDataValue('username'),
      role: roleUs,
      // level: userRoles.level,
      level: userRoles.get('level'),
    });

    // созд./получ. 2 токена. email/role
    const tokens = TokenService.generateToken({ ...tokenDto });
    const token = tokens.accessToken;

    return res.json({ token, activated });
  }
  // ВЫХОД. Удал.Cookie.refreshToken
  async logoutUser(
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
    try {
      // получ refresh из cookie, передача в service, удал.обоих, возвращ.смс об удален.
      const { refreshToken } = req.cookies;
      const { username, email } = req.body;

      const token = await AuthService.logoutUser(refreshToken, username, email);

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
}

export default new AuthController();
