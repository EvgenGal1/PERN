// подкл.ф.контролера для генерац.web токена
import jwt from 'jsonwebtoken';

import TokenModel from '../models/TokenModel';
import ApiError from '../middleware/errors/ApiError';
import { JwtToken, TokenDto } from '../types/auth.interface';
import DatabaseUtils from '../utils/database.utils';

// сохр.токенов по id при регистр/логин
class TokenService {
  // валид./проверка подделки/сроки жизни токена ACCESS и REFRESH
  async validateAccessToken(token: string): Promise<TokenDto> {
    try {
      // верифик.|раскодир.токен. `проверять` на валидность(токен, секр.ключ)
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY!);
      if (!userData || typeof userData !== 'object')
        throw ApiError.unprocessable('Токен не прошёл валидацию');
      return userData as TokenDto;
    } catch (error: unknown) {
      // обраб.ошб.JWT и их локализация
      const message = (error as Error).message;
      switch (message) {
        case 'jwt malformed':
          throw ApiError.unauthorized('Некорректный токен');
        case 'invalid signature':
          throw ApiError.unauthorized('Неверная подпись токена');
        case 'jwt expired':
          throw ApiError.unauthorized('Токен просрочен');
        default:
          throw ApiError.unauthorized(message);
      }
    }
  }
  async validateRefreshToken(token: string): Promise<TokenDto> {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY!);
      if (!userData || typeof userData !== 'object')
        throw ApiError.unprocessable('Токен не прошёл валидацию');
      // доп.проверка срока действия токена
      const tokenRecord = await this.findToken(token);
      if (
        tokenRecord.refreshTokenExpires &&
        tokenRecord.refreshTokenExpires < new Date()
      ) {
        throw ApiError.unauthorized('Токен истёк');
      }
      return userData as TokenDto;
    } catch (error: unknown) {
      // обраб.ошб.JWT и их локализация
      const message = (error as Error).message;
      switch (message) {
        case 'jwt malformed':
          throw ApiError.unauthorized('Некорректный токен');
        case 'invalid signature':
          throw ApiError.unauthorized('Неверная подпись токена');
        case 'jwt expired':
          throw ApiError.unauthorized('Токен просрочен');
        default:
          throw ApiError.unauthorized(message);
      }
    }
  }

  // генер.ACCESS и REFRESH токенов(`полезная нагрузка` прячется в токен)
  async generateToken(payload: any): Promise<JwtToken> {
    try {
      const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET_KEY!,
        { expiresIn: '24h' },
      );
      const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET_KEY!,
        { expiresIn: '30d' },
      );
      return { accessToken, refreshToken };
    } catch (error) {
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
    // проверка существ.токена перед сохр.в БД
    // ^ только для одного устр. Заход с др.устр. выбьет первое. Можно сохр по неск.токенов для польз.устр.(обнов.,удал.стар.токенов)
    const tokenData = await TokenModel.findOne({
      where: { userId, basketId },
    });
    const refreshTokenExpires = new Date(
      Date.now() + +process.env.REFRESH_TOKEN_LIFETIME!,
    );
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
  async removeToken(refreshToken: string) {
    const tokenData = await TokenModel.findOne({ where: { refreshToken } });
    if (!tokenData) throw ApiError.notFound('Токен не найден');
    if (
      tokenData.refreshTokenExpires &&
      tokenData.refreshTokenExpires < new Date()
    )
      throw ApiError.unauthorized('Токен уже истёк');
    await TokenModel.destroy({ where: { refreshToken } });
    return true;
  }

  // Поиск REFRESH токена в БД
  async findToken(refreshToken: string) {
    const tokenData = await TokenModel.findOne({ where: { refreshToken } });
    if (!tokenData) throw ApiError.notFound('Токен не найден');
    if (
      tokenData.refreshTokenExpires &&
      tokenData.refreshTokenExpires < new Date()
    )
      throw ApiError.unauthorized('Токен уже истёк');
    return tokenData;
  }
}

export default new TokenService();
