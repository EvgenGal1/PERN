// подкл. библ. для шифрование пароля нов.польз.
import bcrypt from 'bcrypt';
// подкл.генир.уник.рандом.id
import { v4 as uuidv4 } from 'uuid';

// модель данных табл.User
import UserModel from '../models/UserModel';
// serv разные
import BasketService from './basket.service';
import TokenService from './token.service';
import RoleService from './role.service';
// утилиты/helpы/обраб.ошб./type/dto
import ApiError from '../middleware/errors/ApiError';
import TokenDto from '../dtos/token.dto';
import DatabaseUtils from '../utils/database.utils';
import { AuthCombinedType } from '../types/auth.interface';
// перем.степень шифр.
const hashSync = 5;

class AuthService {
  // РЕГИСТРАЦИЯ
  async signupUser(
    email: string,
    password: string,
    role: string = 'USER',
  ): Promise<AuthCombinedType> {
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      throw ApiError.badRequest(
        `Пользователь с Email <${email}> уже существует`,
      );
    }
    // hashирование(не шифрование) пароля ч/з bcryptjs. 1ый пароль, 2ой степень шифр.
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');
    const hashPassword = await bcrypt.hash(password, saltRounds);
    // генер.уник.ссылку активации ч/з fn v4(подтверждение акаунта)
    const activationLink = `${process.env.SRV_URL}/${process.env.SRV_NAME}/user/activate/${uuidv4()}`;

    // отпр.смс на почту для актив-ии (кому,полн.путь ссылки)
    // ! врем.откл. > ошб. - Invalid login: 535-5.7.8 Username and Password not accepted | 535 5.7.8 Error: authentication failed: Invalid user or password ~~ настр.доступ.почт
    // const mail = await MailService.sendActionMail(email, activationLinkPath);
    // if (!mail || mail.errors) {
    //   console.log("U.serv mail.errors : ", mail.errors);
    //   const errorMessage = mail.message.split("\n")[0];
    //   return ApiError.badRequest(errorMessage, mail.errors);
    // }

    // `получить наименьший доступный идентификатор` из табл.БД
    const smallestFreeId = await DatabaseUtils.getSmallestIDAvailable('user');
    // СОЗД.НОВ.ПОЛЬЗОВАТЕЛЯ (пароль шифр.)
    const user = await UserModel.create({
      id: smallestFreeId,
      email,
      // role,
      username: '',
      password: hashPassword,
      activationLink,
    });
    // привязка.существ.Роли пользователя
    const userRoles = await RoleService.assignUserRole(user.id, role);
    // созд.Корзину по User.id
    const basket = await BasketService.createBasket(user.getDataValue('id'));
    // объ.перед.данн.> Роли > id/email/username/role/level
    const tokenPayload = new TokenDto({
      id: user.id,
      email: user.email,
      username: user.username,
      role,
      level: userRoles.level,
    });
    // созд./получ. 2 токена
    const tokens = await TokenService.generateToken(tokenPayload);
    if (!tokens) throw ApiError.badRequest(`Генерация токенов не прошла`);
    // сохр.refresh в БД
    await TokenService.saveToken(user.id, basket.id, tokens.refreshToken);
    // возвращ.tokens/basket.id
    return { tokens, basketId: basket.id };
  }

  // АВТОРИЗАЦИЯ
  async loginUser(email: string, password: string): Promise<AuthCombinedType> {
    // проверка сущест. eml (позже username)
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      throw ApiError.badRequest(`Пользователь с Email <${email}> не найден`);
    }
    // `сравнивания` пароля с шифрованым
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) throw ApiError.badRequest('Указан неверный пароль');
    // проверка и назначение роли
    const role = await this.checkAndAssignRole(user);
    // объ.перед.данн.> Роли > id/email/username/role/level
    const tokenDto = new TokenDto({
      id: user.id,
      email,
      username: user.username,
      role: role.name,
      level: role.level,
    });
    // созд./получ. 2 токена. email/role
    const tokens = await TokenService.generateToken({ ...tokenDto });
    if (!tokens) throw ApiError.badRequest(`Генерация токенов не прошла`);
    // получ.basket_id
    const basketId = await BasketService.getOneBasket(null, user.id);
    if (!basketId) throw ApiError.badRequest(`Корзины нет`);
    // сохр.refreshToken > user_id и basket_id
    await TokenService.saveToken(user.id, basketId.id, tokens.refreshToken);
    return {
      tokens,
      basketId: basketId.id,
      activated: user.isActivated,
    };
  }

  // АКТИВАЦИЯ АКАУНТА. приним.ссылку актив.us из БД
  async activateUser(activationLink: string) {
    const user = await UserModel.findOne({
      where: { activationLink: activationLink },
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
    const userData = TokenService.validateRefreshToken(refreshToken);
    // поиск токена
    const tokenFromDB = await TokenService.findToken(refreshToken);

    // проверка валид и поиск
    if (!userData || !tokenFromDB)
      throw ApiError.unauthorized('Токен отсутствует');

    // вытаск.польз.с БД по ID
    const user = await UserModel.findByPk(userData.id);
    if (!user) throw ApiError.unauthorized('Пользователь отсутствует');

    // провер.существ.Роли пользователя
    const userRoles = await RoleService.getOneUserRole(user.id, 'user');
    const roleUs = userRoles.get('roleId') === 1 ? 'USER' : 'ADMIN';

    // объ.перед.данн.> Роли > id/email/username/role/level
    const tokenDto = new TokenDto({
      id: user.id,
      email: user.email,
      username: user.username,
      role: roleUs,
      level: userRoles.get('level'),
    });

    // созд./получ. 2 токена. email/role
    const tokens = await TokenService.generateToken({ ...tokenDto });
    if (!tokens) throw ApiError.badRequest(`Генерация токенов не прошла`);

    const basketId = await BasketService.getOneBasket(null, user.id);
    if (!basketId) throw ApiError.badRequest(`Корзины нет`);

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

  // проверка и назначение роли
  private async checkAndAssignRole(
    user: any,
  ): Promise<{ name: string; level: number }> {
    const userRole = await RoleService.getOneUserRole(user.id, 'user');
    // е/и роли нет, сделать "USER"
    if (!userRole) {
      await RoleService.assignUserRole(user.id, 'USER');
      return { name: 'USER', level: 1 };
    }
    // опред.роли
    const name = userRole.get('roleId') === 1 ? 'USER' : 'ADMIN';
    const level: any = userRole.get('level') || 1;

    return { name, level };
  }
}

export default new AuthService();
