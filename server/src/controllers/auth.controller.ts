// подкл. валидацию
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

// модели данных табл.
import UserModel from '../models/UserModel';
// services
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import RoleService from '../services/role.service';
import BasketService from '../services/basket.service';
import TokenService from '../services/token.service';
// обраб.ошб.
import ApiError from '../middleware/errors/ApiError';
// парам.куки
import { COOKIE_OPTIONS } from '../config/api/cookies';

class AuthController {
  // проверка валидации
  private static async validateRequest(req: Request) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw ApiError.badRequest('Некорректные данные', errors.array());
    }
  }
  // РЕГИСТРАЦИЯ
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      // проверка вход.полей на валидацию. шаблоны в route
      await AuthController.validateRequest(req);
      // получ.данн.из тела запроса
      const { email, password, username } = req.body;
      // передача данн.в сервис > возвращ. 2 токена, ID корзины, данн.Польз.
      const userData = await AuthService.registerUser(
        email,
        password,
        username,
      );
      // сохр.в cookie refreshToken/basketId и возвращ.данн.Пользователя
      res
        .cookie(
          'refreshToken',
          userData.tokens.refreshToken,
          COOKIE_OPTIONS.refreshToken,
        )
        .cookie('basketId', userData.basketId, COOKIE_OPTIONS.basketId)
        .status(201)
        .json({
          message:
            'Регистрация пройдена. Проверьте эл.почту для активации учётной записи',
          success: true,
          data: {
            accessToken: userData.tokens.accessToken,
            user: {
              id: userData.user.id,
              email: userData.user.email,
              name: userData.user.username,
            },
            isActivated: userData.isActivated,
            roles: userData.roles,
            // по отдел.
            // roles: userData.user.roles,
            // levels: userData.user.levels,
            // проверка перед добав. > опцион.типов
            // ...(userData.user.roles && { roles: userData.user.roles }),
            // приведение типа > опцион.типов
            // role: (userData.user as User & Role).role,
          },
        });
    } catch (error: unknown) {
      // при ошб. удал.нов.созд.user
      const { email } = req.body;
      const user = await UserModel.findOne({ where: { email } });
      if (user) {
        await UserService.deleteUser(user.getDataValue('id'));
      }
      next(error);
    }
  }

  // АВТОРИЗАЦИЯ
  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      // проверка вход.полей на валидацию
      AuthController.validateRequest(req);
      // получ.данн.из тела запроса
      const { email, password } = req.body;
      // авторизация через сервис
      const userData = await AuthService.loginUser(email, password);
      // сохр.refreshToken/basketId в cookie и возвращ. accessToken/данн.Пользователя
      res
        .cookie(
          'refreshToken',
          userData.tokens.refreshToken,
          COOKIE_OPTIONS.refreshToken,
        )
        .cookie('basketId', userData.basketId, COOKIE_OPTIONS.basketId)
        .status(200)
        .json({
          success: true,
          message: 'Успешный Вход',
          data: {
            accessToken: userData.tokens.accessToken,
            user: {
              id: userData.user.id,
              email: userData.user.email,
              name: userData.user.username,
            },
            isActivated: userData.isActivated,
            roles: userData.roles,
            // roles: userData.user.roles,
            // levels: userData.user.levels,
          },
        });
    } catch (error: unknown) {
      next(error);
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
    } catch (error: unknown) {
      next(error);
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
    } catch (error: unknown) {
      next(error);
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
      const userRoles = await RoleService.getUserRolesAndLevels(user.id);
      // получ.basket_id
      const basket = await BasketService.getOneBasket(undefined, user.id);
      const tokenDto = await AuthService.createTokenDto(
        user,
        userRoles,
        basket.id,
      );
      // созд./получ. 2 токена
      const tokens = await TokenService.generateToken(tokenDto);
      if (!tokens) throw ApiError.badRequest('Генерация токенов не прошла');
      res.status(200).json({
        success: true,
        message: 'Пользователь проверен',
        data: { accessToken: tokens.accessToken },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  // ВЫХОД. Удал.Cookie.refreshToken
  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      // получ.refresh из cookie или заголовка, передача в service, удал.обоих, возвращ.смс об удален.
      const refreshToken =
        req.cookies.refreshToken || req.headers['authorization']?.split(' ')[1];
      await AuthService.logoutUser(refreshToken);
      res
        .clearCookie('refreshToken')
        .json({ success: true, message: 'Вы вышли из системы' });
    } catch (error: unknown) {
      next(error);
    }
  }

  // запрос на сброс пароля
  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    AuthController.validateRequest(req);
    const { email } = req.body;
    try {
      await AuthService.sendPasswordResetEmail(email);
      res.status(200).json({
        success: true,
        message: 'Инструкция для сброса отправлена на email',
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  // обновление пароля
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    AuthController.validateRequest(req);
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
          success: true,
          message: 'Пароль успешно обновлен',
          data: { accessToken: tokens.accessToken },
        });
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new AuthController();
