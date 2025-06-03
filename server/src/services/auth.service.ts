// вкл.операторы > сложн.req
import { Op, Transaction } from 'sequelize';
// подкл. библ. для шифрование пароля нов.польз.
import bcrypt from 'bcrypt';
// подкл.генир.уник.рандом.id
import crypto from 'crypto';

// подкл.к БД
import sequelize from '../config/sequelize';
// модель данных табл.User
import UserModel from '../models/UserModel';
import TokenModel from '../models/TokenModel';
// serv разные
import RoleService from './role.service';
import BasketService from './basket.service';
import TokenService from './token.service';
import MailService from './mail.service';
// утилиты/helpы
import DatabaseUtils from '../utils/database.utils';
// type/dto
import { AuthCombinedType, TokenDto, Tokens } from '../types/auth.interface';
import { NameUserRoles, RoleLevels } from '../types/role.interface';
// обраб.ошб.
import ApiError from '../middleware/errors/ApiError';

class AuthService {
  // уровень хеширования
  private readonly saltRounds = Number(process.env.SALT_ROUNDS) || 10;
  private readonly resetTokenBytes = 32;
  // хэширование пароля (синхрон bcrypt)
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
  // сравнение паролей (синхрон bcrypt)
  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
  // генер.ссылки активации акка
  private generateActivationLink(token: string): string {
    return `${process.env.SRV_URL}/${process.env.SRV_NAME}/auth/activate/${token}`;
  }
  // унифиц.парам.Токена
  async createTokenDto(
    user: UserModel,
    roles: RoleLevels[],
    basketId: number,
  ): Promise<TokenDto> {
    return {
      id: user.id,
      email: user.email,
      username: user.username || '',
      roles,
      basket: basketId,
    };
  }
  // генер.Токена (синхрон crypto)
  private generateResetToken(): string {
    return crypto.randomBytes(this.resetTokenBytes).toString('hex');
  }
  // хеширование строки (синхрон crypto)
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // РЕГИСТРАЦИЯ
  async registerUser(
    email: string,
    password: string,
    username = '',
    role: NameUserRoles = NameUserRoles.USER,
  ): Promise<AuthCombinedType> {
    // нач.транзакции
    return sequelize.transaction(async (transaction: Transaction) => {
      const existingUser = await UserModel.findOne({
        where: { email },
        // передача транзакции в кажд.мтд.
        transaction,
      });
      if (existingUser) {
        throw ApiError.conflict(`Пользователь с Email <${email}> существует`);
      }

      // параллел.req > hash psw, генер.уник.ссы.активации, наименьший ID
      const [hashedPassword, activationLink, smallestFreeId] =
        await Promise.all([
          this.hashPassword(password),
          this.generateActivationLink(crypto.randomUUID()),
          DatabaseUtils.getSmallestIDAvailable('user', transaction),
        ]);

      // СОЗД.НОВ.ПОЛЬЗОВАТЕЛЯ (пароль шифр.)
      const user = await UserModel.create(
        {
          id: smallestFreeId,
          email,
          username,
          password: hashedPassword,
          activationLink,
        },
        { transaction },
      );

      // параллел.req > привязки.существ.Роли Пользователя, созд.Корзину по User.id
      const [userRoles, basket] = await Promise.all([
        RoleService.assignUserRole(user.id, role, 1, transaction),
        BasketService.createBasket(user.id, transaction),
      ]);

      // объ.перед.данн. > id/email/username/role/level/basketId
      const tokenDto = await this.createTokenDto(
        user,
        [{ role: role, level: userRoles.level }],
        basket.id,
      );
      // созд./получ. 2 токена
      const tokens = await TokenService.generateToken(tokenDto);
      if (!tokens) throw ApiError.internal('Генерация токенов не прошла');

      // параллел.req > отпр.смс на почту для актив.акка, сохр.refresh в БД
      await Promise.all([
        MailService.sendActionMail(email, activationLink),
        TokenService.saveToken(
          user.id,
          basket.id,
          tokens.refreshToken,
          transaction,
        ),
      ]);

      // возвращ.tokens/basket.id
      return {
        tokens,
        basketId: basket.id,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        isActivated: false,
        // общ.масс.объ.
        roles: [{ role: role, level: userRoles.level }],
        // отдел.передача
        // roles: [role],
        // levels: [userRoles.level],
        // явно добав.парам. > опцион.типа(Partial)
        // ...(role && { roles: [role] }),
        // ...(userRoles && { levels: [userRoles.level] }),
      };
    });
  }

  // АВТОРИЗАЦИЯ
  async loginUser(email: string, password: string): Promise<AuthCombinedType> {
    // проверка сущест.eml с отдел.вкл.psw
    const user = await UserModel.scope('withPassword').findOne({
      where: { email },
    });
    if (!user)
      throw ApiError.notFound(`Пользователь с Email <${email}> не найден`);

    // валид.пароля с шифрованым
    const isValidPsw = await this.comparePasswords(password, user.password);
    if (!isValidPsw) throw ApiError.unauthorized('Указан неверный пароль');

    // параллел.req > получ. масс.Роли/уровни, basket_id
    const [userRoles, basket] = await Promise.all([
      RoleService.getUserRolesAndLevels(user.id),
      BasketService.getOneBasket(undefined, user.id),
    ]);
    if (!basket) throw ApiError.notFound('Корзина не найдена');

    // объ.перед.данн. > id/email/username/role/level/basketId
    const tokenDto = await this.createTokenDto(user, userRoles, basket.id);
    // созд./получ. 2 токена. email/role
    const tokens = await TokenService.generateToken(tokenDto);
    if (!tokens) throw ApiError.internal('Генерация токенов не удалась');

    // сохр.refreshToken > user_id и basket_id
    await TokenService.saveToken(user.id, basket.id, tokens.refreshToken);
    return {
      tokens,
      basketId: basket.id,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      isActivated: user.isActivated,
      roles: userRoles,
      // добав.сразу
      // ...userRoles,
      // добав.по отдел.
      // roles: userRoles.roles,
      // levels: userRoles.levels,
      // добав.перебором
      // roles: userRoles.roles.map((role) => role),
      // levels: userRoles.levels.map((level) => level),
    };
  }

  // АКТИВАЦИЯ АКАУНТА. приним.ссылку актив.us из БД
  async activateUser(activationLink: string): Promise<void> {
    const user = await UserModel.findOne({
      where: { activationLink: this.generateActivationLink(activationLink) },
    });
    if (!user) throw ApiError.badRequest('Недопустимая ссылка активации');
    // флаг в true и обнов.
    await user.update({ isActivated: true });
  }

  // ПЕРЕЗАПИСЬ ACCESS|REFRESH токен. Отправ.refresh, получ.access и refresh
  async refreshUser(refreshToken: string): Promise<Tokens> {
    // е/и нет то ошб.не авториз
    if (!refreshToken) throw ApiError.unauthorized('Требуется авторизация');

    // валид.токен.refresh
    const userData = await TokenService.validateRefreshToken(refreshToken);
    // поиск токена
    const token = await TokenService.findToken(refreshToken);
    // проверка валид и поиска Токена
    if (!userData?.id || !token) throw ApiError.unauthorized('Неверный токен');

    // параллел.req > получ. user по ID, масс.Роли/уровни
    const [user, userRoles] = await Promise.all([
      UserModel.findByPk(userData.id),
      RoleService.getUserRolesAndLevels(userData.id),
    ]);
    if (!user) throw ApiError.notFound('Пользователь не найден');
    if (!userRoles.length) throw ApiError.notFound('Роли не найдены');

    // объ.перед.данн.> Роли > id/email/username/role/level
    const tokenDto = await this.createTokenDto(user, userRoles, token.basketId);
    // созд./получ. 2 токена. email/role
    const tokens = await TokenService.generateToken(tokenDto);
    if (!tokens) throw ApiError.internal('Генерация токенов не удалась');

    // сохр./возврат Токенов
    await TokenService.saveToken(user.id, token.basketId, tokens.refreshToken);
    return { tokens };
  }

  // ВЫХОД. Удален.refreshToken из БД ч/з token.serv
  async logoutUser(refreshToken: string): Promise<boolean> {
    // пров.переданого токена
    if (!refreshToken)
      throw ApiError.badRequest('Отсутствует токен обновления');
    await TokenService.removeToken(refreshToken);
    return true;
  }

  // отправка на email инструкции по сбросу пароля
  async sendPasswordResetEmail(email: string): Promise<void> {
    // проверки users/token
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw ApiError.notFound('Пользователь не найден');

    // генер./хеширование уник.Токена сброса пароля
    const resetToken = this.generateResetToken();
    const hashedToken = this.hashToken(resetToken);

    // обнов.Токена/срок действия сброса
    await TokenModel.update(
      {
        resetToken: hashedToken,
        resetTokenExpires: new Date(
          Date.now() + Number(process.env.RESET_TOKEN_LIFETIME),
        ),
      },
      { where: { userId: user.id } },
    );

    // отправка смс на email > сброса пароля
    const resetLink = `${process.env.SRV_URL}/auth/reset-password/${resetToken}`;
    await MailService.sendActionMail(email, resetLink);
  }

  // обновление пароля
  async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<Tokens> {
    // расшифр.вход.Токен
    const hashedToken = this.hashToken(resetToken);
    // получение/проверки в БД Токена/срока
    const tokenEntry = await TokenModel.findOne({
      where: {
        resetToken: hashedToken,
        resetTokenExpires: { [Op.gt]: new Date(Date.now()) },
      },
    });
    if (!tokenEntry) throw ApiError.badRequest('Неверный или истёкший Токен');

    const user = await UserModel.findByPk(tokenEntry.userId);
    if (!user) throw ApiError.notFound('Пользователь не найден');

    // параллел.req > получ. хеш.нов.пароль, масс.Роли/уровни
    const [hashedPassword, userRoles] = await Promise.all([
      this.hashPassword(newPassword),
      RoleService.getUserRolesAndLevels(user.id),
    ]);

    // параллел.req > обнов. user.psw, Токен/срок
    await Promise.all([
      user.update({ password: hashedPassword }),
      tokenEntry.update({ resetToken: null, resetTokenExpires: null }),
    ]);

    const tokenDto = await this.createTokenDto(
      user,
      userRoles,
      tokenEntry.basketId,
    );
    // созд./получ. 2 токена
    const tokens = await TokenService.generateToken(tokenDto);
    if (!tokens) throw ApiError.internal('Генерация токенов не удалась');

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
