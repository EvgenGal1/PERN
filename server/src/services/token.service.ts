// подкл.ф.контролера для генерац.web токена
import jwt from 'jsonwebtoken';

import TokenModel from '../models/TokenModel';
import DatabaseUtils from '../utils/database.utils';
import { JwtToken, TokenDto } from '../types/auth.interface';
import ApiError from '../middleware/errors/ApiError';

// сохр.токенов по id при регистр/логин
class TokenService {
  // обраб.ошб.JWT и их локализация
  private handleJwtError(error: unknown): never {
    // [Сохранена оригинальная обработка ошибок]
    const message = (error as Error).message;
    switch (message) {
      case 'jwt malformed':
        throw ApiError.unauthorized('Некорректный токен');
      case 'invalid signature':
        throw ApiError.unauthorized('Неверная подпись');
      case 'jwt expired':
        throw ApiError.unauthorized('Токен просрочен');
      default:
        throw ApiError.unauthorized('Ошибка авторизации');
    }
  }
  // валид./проверка подделки/сроки жизни токена ACCESS и REFRESH
  async validateAccessToken(token: string): Promise<TokenDto> {
    try {
      // верифик.|раскодир.токен. `проверять` на валидность(токен, секр.ключ)
      const data = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY!);
      if (typeof data !== 'object')
        throw ApiError.unauthorized('Неверный формат Токена');
      return data as TokenDto;
    } catch (error: unknown) {
      this.handleJwtError(error);
    }
  }
  async validateRefreshToken(token: string): Promise<TokenDto> {
    try {
      const data = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY!);
      if (typeof data !== 'object')
        throw ApiError.unauthorized('Неверный формат токена');
      // доп.проверка срока действия токена
      const tokenRecord = await this.findToken(token);
      if (
        !tokenRecord.refreshTokenExpires ||
        tokenRecord.refreshTokenExpires < new Date()
      ) {
        throw ApiError.unauthorized('Токен истёк');
      }
      return data as TokenDto;
    } catch (error: unknown) {
      this.handleJwtError(error);
    }
  }

  // генер.ACCESS и REFRESH токенов(`полезная нагрузка` прячется в токен)
  async generateToken(payload: TokenDto): Promise<JwtToken> {
    try {
      const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET_KEY!,
        { expiresIn: process.env.RESET_TOKEN_LIFETIME },
      );
      const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET_KEY!,
        { expiresIn: process.env.REFRESH_TOKEN_LIFETIME },
      );
      return { accessToken, refreshToken };
    } catch (error: unknown) {
      throw ApiError.conflict(
        `Ошибка генерации токенов: ${(error as Error).message}`,
      );
    }
  }

  // сохр.REFRESH токен в БД для польз.
  async saveToken(
    userId: number,
    basketId: number,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokenExpires = new Date(
      Date.now() + +process.env.REFRESH_TOKEN_LIFETIME!,
    );
    // проверка существ.токена перед сохр.в БД
    // ^ только для одного устр. Заход с др.устр. выбьет первое. Можно сохр по неск.токенов для польз.устр.(обнов.,удал.стар.токенов)
    const tokenData = await TokenModel.findOne({
      where: { userId, basketId },
    });
    // обнов.Токен/срок или созд.нов.Токен
    if (tokenData) {
      await tokenData.update({ refreshToken, refreshTokenExpires });
    } else {
      const smallestFreeId =
        await DatabaseUtils.getSmallestIDAvailable('token');
      await TokenModel.create({
        id: smallestFreeId,
        userId,
        basketId,
        refreshToken,
        refreshTokenExpires,
      });
    }
  }

  // Удален.REFRESH из БД
  async removeToken(refreshToken: string): Promise<boolean> {
    const token = await TokenModel.findOne({ where: { refreshToken } });
    if (!token) throw ApiError.notFound('Токен не найден');
    if (token.refreshTokenExpires && token.refreshTokenExpires < new Date())
      throw ApiError.unauthorized('Токен уже истёк');
    await token.destroy();
    return true;
  }

  // Поиск REFRESH токена в БД
  async findToken(refreshToken: string): Promise<TokenModel> {
    const token = await TokenModel.findOne({ where: { refreshToken } });
    if (!token) throw ApiError.notFound('Токен не найден');
    if (token.refreshTokenExpires! < new Date()) {
      throw ApiError.unauthorized('Токен истёк');
    }
    return token;
  }
}

export default new TokenService();
