// подкл. валидацию
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

// модели данных табл.
import UserModel from '../models/UserModel';
// services
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import BasketService from '../services/basket.service';
import TokenService from '../services/token.service';
// обраб.ошб.
import ApiError from '../middleware/errors/ApiError';
// парам.куки
import { COOKIE_OPTIONS } from '../config/api/cookies';

class AuthController {
  // РЕГИСТРАЦИЯ
  async signupUser(req: Request, res: Response, next: NextFunction) {
    try {
      // проверка вход.полей на валидацию. шаблоны в route
      const errorsValid = validationResult(req);
      // res на front смс с масс.ошб.
      if (!errorsValid.isEmpty()) {
        return next(
          ApiError.badRequest(
            'Некорректые данные при Регистрации',
            errorsValid.array(),
          ),
        );
      }
      // получ.данн.из тела запроса
      const { email, password, username } = req.body;
      // передача данн.в сервис > возвращ. 2 токена, ID корзины, данн.Польз.
      const userData = await AuthService.signupUser(email, password, username);
      const { refreshToken } = userData.tokens;
      // сохр.в cookie refreshToken/basketId и возвращ.данн.Пользователя
      res
        .cookie('refreshToken', refreshToken, COOKIE_OPTIONS.refreshToken)
        .cookie('basketId', userData.basketId, COOKIE_OPTIONS.basketId)
        .status(201)
        .json({
          message:
            'Регистрация пройдена. Проверьте эл.почту для активации учётной записи',
          success: true,
          data: {
            user: {
              id: userData.user.id,
              email: userData.user.email,
              name: userData.user.username,
              isActivated: userData.user.isActivated,
              roles: userData.user.roles,
              levels: userData.user.levels,
              // проверка перед добав. > опцион.типов
              // ...(userData.user.roles && { roles: userData.user.roles }),
              // приведение типа > опцион.типов
              // role: (userData.user as User & Role).role,
            },
          },
        });
    } catch (error: unknown) {
      // при ошб. удал.нов.созд.user
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
        throw ApiError.unprocessable('Некорректный Вход', errorsValid.array());
      }
      // получ.данн.из тела запроса
      const { email, password } = req.body;
      // авторизация через сервис, получ.данн.
      const userData = await AuthService.loginUser(email, password);
      const { refreshToken, accessToken } = userData.tokens;
      // сохр.refreshToken/basketId в cookie и возвращ. accessToken/данн.Пользователя
      res
        .cookie('refreshToken', refreshToken, COOKIE_OPTIONS.refreshToken)
        .cookie('basketId', userData.basketId, COOKIE_OPTIONS.basketId)
        .status(200)
        .json({
          success: true,
          message: 'Успешный Вход',
          data: {
            accessToken: accessToken,
            user: {
              id: userData.user.id,
              email: userData.user.email,
              name: userData.user.username,
              isActivated: userData.user.isActivated,
              roles: userData.user.roles,
              levels: userData.user.levels,
            },
          },
        });
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
        .json({ accessToken: userData.tokens.accessToken });
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
      // получ.масс.все Роли/уровни Пользователя
      const userRoles = await AuthService.getAndTransformUserRolesAndLevels(
        user.id,
      );
      // получ.basket_id
      const basket = await BasketService.getOneBasket(null, user.id);
      const tokenDto = await AuthService.createTokenDto(
        user,
        userRoles.roles,
        userRoles.levels,
        basket.id,
      );
      // созд./получ. 2 токена
      const tokens = await TokenService.generateToken(tokenDto);
      if (!tokens) throw ApiError.badRequest('Генерация токенов не прошла');
      res.status(200).json({ accessToken: tokens.accessToken });
    } catch (error: unknown) {
      return next(error);
    }
  }

  // ВЫХОД. Удал.Cookie.refreshToken
  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      // получ.refresh из cookie или заголовка, передача в service, удал.обоих, возвращ.смс об удален.
      const refreshToken =
        req.cookies.refreshToken || req.headers['authorization']?.split(' ')[1];
      const { username, email } = req.body;
      await AuthService.logoutUser(refreshToken, username, email);
      res.clearCookie('refreshToken').json({ message: 'Вы вышли из системы' });
    } catch (error: unknown) {
      return next(error);
    }
  }

  // запрос на сброс пароля
  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest('Некорректные данные', errors.array()));
    }
    const { email } = req.body;
    try {
      await AuthService.sendPasswordResetEmail(email);
      res
        .status(200)
        .json({ message: 'Инструкция для сброса отправлена на email' });
    } catch (error: unknown) {
      return next(error);
    }
  }

  // обновление пароля
  async completePasswordReset(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest('Некорректные данные', errors.array()));
    }
    const token = req.params.token;
    const password = req.body.password;
    if (!token || !password) {
      return next(ApiError.badRequest('Токен и новый пароль обязательны'));
    }
    try {
      const { tokens } = await AuthService.resetPassword(token, password);
      res
        .cookie(
          'refreshToken',
          tokens.refreshToken,
          COOKIE_OPTIONS.refreshToken,
        )
        .status(200)
        .json({
          message: 'Пароль успешно обновлен',
          accessToken: tokens.accessToken,
        });
    } catch (error: unknown) {
      return next(error);
    }
  }
}

export default new AuthController();
