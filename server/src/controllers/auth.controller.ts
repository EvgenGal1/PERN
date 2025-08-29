// подкл. валидацию
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

// модели данных табл.
// services
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
// обраб.ошб.
import ApiError from '../middleware/errors/ApiError';
// парам.куки
import { COOKIE_OPTIONS } from '../config/api/cookies';

class AuthController {
  // проверка валидации
  private static async validateRequest(req: Request) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => ({
        message: err.msg,
        param: err.param,
        value: err.value,
      }));
      throw ApiError.badRequest('Некорректные данные', errorMessages);
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
      // сохр.в cookie tokenRefresh/basketId и возвращ.данн.Пользователя
      res
        .cookie(
          'tokenRefresh',
          userData.tokens.tokenRefresh,
          COOKIE_OPTIONS.tokenRefresh,
        )
        .cookie('basketId', userData.basketId, COOKIE_OPTIONS.basketId)
        .status(201)
        .json({
          message:
            'Регистрация пройдена. Проверьте эл.почту для активации учётной записи',
          success: true,
          data: {
            tokenAccess: userData.tokens.tokenAccess,
            user: {
              id: userData.user.id,
              email: userData.user.email,
              username: userData.user.username,
              phoneNumber: userData.user.phoneNumber,
              clientId: userData.user.clientId,
            },
            basket: userData.basketId,
            roles: userData.roles,
            isActivated: userData.isActivated,
          },
        });
    } catch (error: unknown) {
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
      // сохр.tokenRefresh/basketId в cookie и возвращ. tokenAccess/данн.Пользователя
      res
        .cookie(
          'tokenRefresh',
          userData.tokens.tokenRefresh,
          COOKIE_OPTIONS.tokenRefresh,
        )
        .cookie('basketId', userData.basketId, COOKIE_OPTIONS.basketId)
        .status(200)
        .json({
          success: true,
          message: 'Успешный Вход',
          data: {
            tokenAccess: userData.tokens.tokenAccess,
            user: {
              id: userData.user.id,
              email: userData.user.email,
              username: userData.user.username,
              phoneNumber: userData.user.phoneNumber,
              clientId: userData.user.clientId,
            },
            basket: userData.basketId,
            roles: userData.roles,
            availableCommands: userData.availableCommands,
            isActivated: userData.isActivated,
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
      const tokenRefresh = req.signedCookies.tokenRefresh;
      // е/и нет то ошб.не авториз
      if (!tokenRefresh)
        throw ApiError.unauthorized(
          'Требуется авторизация для перезаписи Токенов',
        );
      const userData = await AuthService.refreshUser(tokenRefresh);
      res
        .cookie(
          'tokenRefresh',
          userData.tokens.tokenRefresh,
          COOKIE_OPTIONS.tokenRefresh,
        )
        .status(200)
        .json({
          success: true,
          message: 'Произведена Перезапись Токенов',
          data: { tokenAccess: userData.tokens.tokenAccess },
        });
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * ПРОВЕРКА Пользователя
   * @returns JSON с +/- res { success: true/false, message: string, + data: { user: UserData } } - HTTP 401
   */
  async checkUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getOneUser(req.auth!.id);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Пользователь не найден',
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: `Пользователь ${user.username} проверен`,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            phoneNumber: user.phoneNumber,
            clientId: user.clientId,
          },
        },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * ВЫХОД. Удал.Cookie.tokenRefresh
   * получ.refresh из cookie, обраб.отсутст.refresh, передача/удал.refresh в service, возвращ. удал.cookie и смс
   * @returns JSON - { success: true, message: 'Сессия завершена' } и очистка cookies - refreshToken и basketId
   */
  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenRefresh = req.signedCookies['tokenRefresh'];
      // если нет Токена и/или ошб.в serv не крашим удал.cookie
      if (tokenRefresh) {
        await AuthService.logoutUser(tokenRefresh).catch(() =>
          console.warn('Токен был недействительным при Выходе'),
        );
      }
      // выход в любом случае
      res
        .clearCookie('tokenRefresh')
        .clearCookie('basketId')
        .json({ success: true, message: 'Сессия завершена' });
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
          'tokenRefresh',
          tokens.tokenRefresh,
          COOKIE_OPTIONS.tokenRefresh,
        )
        .status(200)
        .json({
          success: true,
          message: 'Пароль успешно обновлен',
          data: { tokenAccess: tokens.tokenAccess },
        });
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new AuthController();
