// подкл. валидацию
import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

// модели данных табл.
import UserModel from '../models/UserModel';
// services
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import TokenService from '../services/token.service';
import RoleService from '../services/role.service';
// обраб.ошб.
import ApiError from '../middleware/errors/ApiError';
// выборка полей
import TokenDto from '../dtos/token.dto';
// парам.куки
import { COOKIE_OPTIONS } from '../config/api/cookies';

class AuthController {
  // РЕГИСТРАЦИЯ
  async signupUser(req: Request, res: Response, next: NextFunction) {
    try {
      // проверка вход.полей на валидацию. шаблоны в route
      const errorsValid = validationResult(req);
      // е/и проверка не прошла(не пусто) - возвращ.Ответ на front смс ошб.(кастомизируем) + errors
      if (!errorsValid.isEmpty()) {
        return next(
          ApiError.badRequest(
            'Некорректые данные при Регистрации',
            errorsValid.array(),
          ),
        );
      }

      // получ.данн.из тела запроса
      const { email, password } = req.body;
      // передача данн.в fn для Service (возвращ.data - ссыл.актив, 2 токена, данн.польз., смс)
      const userData = await AuthService.signupUser(email, password);

      // сохр.в cookie refreshToken/basketId и возвращ. access
      const { refreshToken, accessToken } = userData.tokens;
      res
        .cookie('refreshToken', refreshToken, COOKIE_OPTIONS.refreshToken)
        .cookie('basketId', userData.basketId, COOKIE_OPTIONS.basketId)
        .status(201)
        .json({
          message: 'Пользователь успешно зарегистрирован',
          accessToken,
        });
    } catch (error: unknown) {
      // удаление user если успел созд.но ошибка
      const { email } = req.body;
      const user = await UserModel.findOne({ where: { email } });
      if (user) {
        await UserService.deleteUser(user.getDataValue('id'));
      }
      return next(error);
    }
  }

  // АВТОРИЗАЦИЯ
  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      // проверка вход.полей на валидацию
      const errorsValid = validationResult(req);
      if (!errorsValid.isEmpty()) {
        throw ApiError.unprocessable('Некорректый Вход', errorsValid.array());
      }

      const { email, password } = req.body;
      // авторизация через сервис
      const userData = await AuthService.loginUser(email, password);

      // сохр.refreshToken/basketId в cookie и возвращ. accessToken и сост.активации
      const { refreshToken, accessToken } = userData.tokens;
      const activated = userData.activated ?? false;
      res
        .cookie('refreshToken', refreshToken, COOKIE_OPTIONS.refreshToken)
        .cookie('basketId', userData.basketId, COOKIE_OPTIONS.basketId)
        .status(200)
        .json({ tokens: accessToken, activated });
    } catch (error: unknown) {
      return next(error);
    }
  }

  // АКТИВАЦИЯ АКАУНТА. По ссылке в почту
  async activateUser(req: Request, res: Response, next: NextFunction) {
    try {
      // из стр.получ.ссы.актив.
      const activationLink = req.params.link;
      await AuthService.activateUser(activationLink);
      // перенаправить на FRONT после перехода по ссылки
      return res.redirect(`${process.env.CLT_URL}/user`);
    } catch (error) {
      // return next(ApiError.badRequest(`НЕ удалось АКТИВАВИРАВАТЬ - ${error}.`));
      return next(error);
    }
  }

  // ПЕРЕЗАПИСЬ ACCESS токен. Отправ.refresh, получ.access и refresh
  async refreshUser(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken =
        req.cookies.refreshToken || req.headers['authorization']?.split(' ')[1];
      const userData = await AuthService.refreshUser(refreshToken);
      res
        .cookie(
          'refreshToken',
          userData.tokens.refreshToken,
          COOKIE_OPTIONS.refreshToken,
        )
        .status(200)
        .json(userData);
      // return res.json(username, email); // ! ошб. в routes
    } catch (error) {
      return next(error);
    }
  }

  // ПРОВЕРКА. Польз.
  async checkUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth?.id) {
        return next(ApiError.badRequest('ID Пользователя не найден'));
      }
      const user = await UserService.getOneUser(req.auth.id);
      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден'));
      }

      // const activated = user.isActivated; // ! по TS
      const activated = user.getDataValue('isActivated');
      const userRoles = await RoleService.getOneUserRole(
        user.getDataValue('id'),
        'user',
      );
      // опред.Роли User
      let roleUs = userRoles.get('roleId') === 1 ? 'USER' : 'ADMIN';

      // объ.перед.данн.> Роли > id/email/username/role/level
      const tokenDto = new TokenDto({
        id: user.getDataValue('id'),
        email: user.getDataValue('email'),
        username: user.getDataValue('username'),
        role: roleUs,
        level: userRoles.get('level'),
      });

      // созд./получ. 2 токена. email/role
      const tokens = await TokenService.generateToken({ tokenDto });
      if (!tokens) throw ApiError.badRequest(`Генерация токенов не прошла`);

      res.status(200).json({ token: tokens.accessToken, activated });
    } catch (error: unknown) {
      return next(error);
    }
  }

  // ВЫХОД. Удал.Cookie.refreshToken
  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      // получ refresh из cookie, передача в service, удал.обоих, возвращ.смс об удален.
      const { refreshToken } = req.cookies;
      const { username, email } = req.body;

      await AuthService.logoutUser(refreshToken, username, email);

      res.clearCookie('refreshToken').json({ message: 'Вы вышли из системы' });
    } catch (error: unknown) {
      return next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
}

export default new AuthController();
