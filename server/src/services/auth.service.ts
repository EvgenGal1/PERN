// подкл. библ. для шифрование пароля нов.польз.
import bcrypt from 'bcrypt';
// подкл.генир.уник.рандом.id
import crypto from 'crypto';

// модель данных табл.User
import UserModel from '../models/UserModel';
import TokenModel from '../models/TokenModel';
import UserRoleModel from '../models/UserRoleModel';
// serv разные
import RoleService from './role.service';
import BasketService from './basket.service';
import TokenService from './token.service';
import MailService from './mail.service';
// утилиты/helpы
import DatabaseUtils from '../utils/database.utils';
// type/dto
import { AuthCombinedType, TokenDto } from '../types/auth.interface';
// обраб.ошб.
import ApiError from '../middleware/errors/ApiError';

class AuthService {
  // уровень хеширования
  private readonly saltRounds = parseInt(process.env.SALT_ROUNDS || '10');

  // хэширование пароля
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  // сравнение паролей
  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // унифиц.парам.Токена
  async createTokenDto(
    user: any,
    roles: string[],
    levels: number[],
    basket: number,
  ): Promise<TokenDto> {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      roles,
      levels,
      basket,
    };
  }

  // генер.Токена > сброса пароля
  private async processingResetToken(token?: string): Promise<{
    resetToken: string;
    hashedToken: string;
  }> {
    const resetToken = token || crypto.randomBytes(32).toString('hex'); // оригин.Токен
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex'); // хэшир.Токен
    return { resetToken, hashedToken };
  }

  // получить и преобразов.все Роли/уровни Пользователя
  async getAndTransformUserRolesAndLevels(
    userId: number,
  ): Promise<{ roles: string[]; levels: number[] }> {
    const userRoles = await RoleService.getAllUserRoles(userId);
    // объ.привязки roleId к именам
    const roleMap: Record<number, string> = {
      1: 'USER',
      2: 'ADMIN',
      3: 'MODER',
      4: 'MELOMAN',
      5: 'VISUAL',
    };
    // перебор в масс. role(ч/з объ.)/level (сразу)
    const roles = userRoles.map((userRole) => roleMap[userRole.roleId]);
    const levels = userRoles.map((userRole) => userRole.level);
    // возвр.объ.масс.
    return { roles, levels };
  }

  // РЕГИСТРАЦИЯ
  async signupUser(
    email: string,
    password: string,
    username: string = '',
    role: string = 'USER',
  ): Promise<AuthCombinedType> {
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      throw ApiError.badRequest(
        `Пользователь с Email <${email}> уже существует`,
      );
    }
    // hashирование(не шифрование) пароля ч/з bcrypt. 1ый пароль, 2ой степень шифр.
    const hashedPassword = await this.hashPassword(password);
    // генер.уник.ссылку активации ч/з fn v4(подтверждение акаунта)
    const activationLink = `${process.env.SRV_URL}/${process.env.SRV_NAME}/auth/activate/${crypto.randomUUID()}`;
    // отпр.смс на почту для актив-ии (кому,полн.путь ссылки)
    await MailService.sendActionMail(email, activationLink);
    // `получить наименьший доступный идентификатор` из табл.БД
    const smallestFreeId = await DatabaseUtils.getSmallestIDAvailable('user');
    // СОЗД.НОВ.ПОЛЬЗОВАТЕЛЯ (пароль шифр.)
    const user = await UserModel.create({
      id: smallestFreeId,
      email,
      username,
      password: hashedPassword,
      activationLink,
    });
    // привязка.существ.Роли пользователя
    const userRoles = await RoleService.assignUserRole(user.id, role);
    // созд.Корзину по User.id
    const basket = await BasketService.createBasket(user.id);
    // объ.перед.данн. > id/email/username/role/level/basketId
    const tokenDto = await this.createTokenDto(
      user,
      [role],
      [userRoles.level],
      basket.id,
    );
    // созд./получ. 2 токена
    const tokens = await TokenService.generateToken(tokenDto);
    if (!tokens) throw ApiError.badRequest('Генерация токенов не прошла');
    // сохр.refresh в БД
    await TokenService.saveToken(user.id, basket.id, tokens.refreshToken);
    // возвращ.tokens/basket.id
    return {
      tokens,
      basketId: basket.id,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isActivated: false,
        roles: [role],
        levels: [userRoles.level],
        // явно добав.парам. > опцион.типа(Partial)
        // ...(role && { roles: [role] }),
        // ...(userRoles && { levels: [userRoles.level] }),
      },
    };
  }

  // АВТОРИЗАЦИЯ
  async loginUser(email: string, password: string): Promise<AuthCombinedType> {
    // проверка сущест. eml (позже username)
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      throw ApiError.badRequest(`Пользователь с Email <${email}> не найден`);
    }
    // валид.пароля с шифрованым
    const isPswValid = await this.comparePasswords(password, user.password);
    if (!isPswValid) throw ApiError.badRequest('Указан неверный пароль');
    // получ.масс.все Роли/уровни Пользователя
    const userRoles = await this.getAndTransformUserRolesAndLevels(user.id);
    // получ.basket_id
    const basket = await BasketService.getOneBasket(null, user.id);
    if (!basket) throw ApiError.badRequest(`Корзины нет`);
    // объ.перед.данн. > id/email/username/role/level/basketId
    const tokenDto = await this.createTokenDto(
      user,
      userRoles.roles,
      userRoles.levels,
      basket.id,
    );
    // созд./получ. 2 токена. email/role
    const tokens = await TokenService.generateToken(tokenDto);
    if (!tokens) throw ApiError.badRequest(`Генерация токенов не прошла`);
    // сохр.refreshToken > user_id и basket_id
    await TokenService.saveToken(user.id, basket.id, tokens.refreshToken);
    return {
      tokens,
      basketId: basket.id,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isActivated: user.isActivated,
        roles: userRoles.roles,
        levels: userRoles.levels,
        // добав.перебором
        // roles: userRoles.roles.map((role) => role),
        // levels: userRoles.levels.map((level) => level),
      },
    };
  }

  // АКТИВАЦИЯ АКАУНТА. приним.ссылку актив.us из БД
  async activateUser(activationLink: string) {
    const user = await UserModel.findOne({
      where: {
        activationLink: `${process.env.SRV_URL}/${process.env.SRV_NAME}/auth/activate/${activationLink}`,
      },
    });
    if (!user) {
      throw ApiError.badRequest(
        `Некорректная ссылка активации. Пользователя НЕТ`,
      );
    }
    // флаг в true и сохр.
    user.set('isActivated', true);
    user.save();
  }

  // ПЕРЕЗАПИСЬ ACCESS|REFRESH токен. Отправ.refresh, получ.access и refresh
  async refreshUser(refreshToken: string) {
    // е/и нет то ошб.не авториз
    if (!refreshToken) throw ApiError.unauthorized('Требуется авторизация');
    // валид.токен.refresh
    const userData = await TokenService.validateRefreshToken(refreshToken);
    // поиск токена
    const tokenFromDB = await TokenService.findToken(refreshToken);
    // проверка валид и поиск
    if (!userData || !tokenFromDB)
      throw ApiError.unauthorized('Токен отсутствует');
    // получ.польз.с БД по ID
    const user = await UserModel.findByPk(userData.id);
    if (!user) throw ApiError.unauthorized('Пользователь отсутствует');
    // масс.получ./проверить все Роли/уровни Пользователя
    const userRoles = await this.getAndTransformUserRolesAndLevels(user.id);
    if (!userRoles.roles.length) throw ApiError.notFound('Роли не найдены');
    // объ.перед.данн.> Роли > id/email/username/role/level
    const tokenDto = await this.createTokenDto(
      user,
      userRoles.roles,
      userRoles.levels,
      tokenFromDB.basketId,
    );

    // созд./получ. 2 токена. email/role
    const tokens = await TokenService.generateToken(tokenDto);
    if (!tokens) throw ApiError.badRequest(`Генерация токенов не прошла`);
    // получ. корзину
    const basketId = await BasketService.getOneBasket(null, user.id);
    if (!basketId) throw ApiError.badRequest(`Корзины нет`);
    // сохр./возврат Токенов
    await TokenService.saveToken(user.id, basketId.id, tokens.refreshToken);
    return { tokens };
  }

  // ВЫХОД. Удален.refreshToken из БД ч/з token.serv
  async logoutUser(refreshToken: string, username: string, email: string) {
    // пров.переданого токена
    if (!refreshToken) {
      throw ApiError.badRequest(`Токен от ${username} <${email}> не передан`);
    }
    await TokenService.removeToken(refreshToken);
    return `Токен Пользователя ${username} <${email}> удалён`;
  }

  // отправка на email инструкции по сбросу пароля
  async sendPasswordResetEmail(email: string) {
    // проверки user/token
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      throw ApiError.notFound(`Пользователь с Email <${email}> не найден`);
    }
    const token = await TokenModel.findOne({ where: { userId: user.id } });
    if (!token) {
      throw ApiError.internal('Не найден Токена Пользователя');
    }
    // генер.уник.Токена сброса пароля
    const { resetToken, hashedToken } = await this.processingResetToken();
    const resetTokenExpires = new Date(
      Date.now() + +process.env.RESET_TOKEN_LIFETIME!,
    );
    // обнов.Токена/времени сброса
    await token.update({ resetToken: hashedToken, resetTokenExpires });
    // отправка смс на email > сбросf пароля
    const resetLink = `${process.env.SRV_URL}/auth/reset-password/${resetToken}`;
    await MailService.sendActionMail(email, resetLink);
  }

  // обновление пароля
  async resetPassword(resetToken: string, newPassword: string) {
    // расшифр.вход.Токен
    const { hashedToken } = await this.processingResetToken(resetToken);
    // получение/проверки Токена/времени
    const tokenEntry = await TokenModel.findOne({
      where: { resetToken: hashedToken },
    });
    if (!tokenEntry) throw ApiError.badRequest('Неверный или истёкший Токен');
    if (
      tokenEntry.resetTokenExpires &&
      tokenEntry.resetTokenExpires < new Date()
    ) {
      throw ApiError.badRequest('Токен истек');
    }
    const user = await UserModel.findByPk(tokenEntry.userId, {
      // связь напрямую с авто.имен.модели без as
      include: [{ model: UserRoleModel }],
    });
    if (!user || !user.UserRoleModels) {
      throw ApiError.badRequest('Пользователь не найден');
    }
    // хеш./обнов.нов.пароль в БД
    const hashedPassword = await this.hashPassword(newPassword);
    await user.update({ password: hashedPassword });
    // обнов. Токен/время после сброса
    await tokenEntry.update({
      resetToken: null as unknown as string,
      resetTokenExpires: null as unknown as Date,
    });
    // получ.масс.все Роли/уровни Пользователя
    const usersRoles = await this.getAndTransformUserRolesAndLevels(user.id);
    const tokenDto = await this.createTokenDto(
      user,
      usersRoles.roles,
      usersRoles.levels,
      tokenEntry.basketId,
    );
    // созд./получ. 2 токена
    const tokens = await TokenService.generateToken(tokenDto);
    if (!tokens) throw ApiError.badRequest('Генерация токенов не прошла');
    // сохр.refresh в БД
    await TokenService.saveToken(
      user.id,
      tokenEntry.basketId,
      tokens.refreshToken,
    );
    return { tokens };
  }
}

export default new AuthService();
