import { Transaction } from 'sequelize';
// подкл.ф.контролера для генерац.web токена
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import TokenModel from '../models/TokenModel';
import DatabaseUtils from '../utils/database.utils';
import { JwtToken, TokenDto } from '../types/auth.interface';
import ApiError from '../middleware/errors/ApiError';

// сохр.токенов по id при регистр/логин
class TokenService {
  // Хеширование Токена
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // обраб.ошб.JWT и их локализация
  private handleJwtError(error: unknown): never {
    // [Сохранена оригинальная обработка ошибок]
    const message = (error as Error).message;
    if (message.includes('expired')) {
      throw ApiError.unauthorized('Токен просрочен');
    }
    if (message.includes('invalid')) {
      throw ApiError.unauthorized('Неверная подпись');
    }
    if (message.includes('malformed')) {
      throw ApiError.unauthorized('Некорректный токен');
    }
    throw ApiError.unauthorized('Ошибка авторизации');
  }
  // валид./проверка подделки/сроки жизни токена ACCESS и REFRESH
  async validateAccessToken(token: string): Promise<TokenDto> {
    try {
      // `проверять` на валидность(токен, секр.ключ)
      const data = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY!);
      if (typeof data !== 'object' || !('id' in data)) {
        throw ApiError.unauthorized('Неверный формат Токена');
      }
      // проверка срока действия
      if (data.exp && data.exp * 1000 < Date.now()) {
        throw ApiError.unauthorized('Токен истёк');
      }
      return data as TokenDto;
    } catch (error: unknown) {
      this.handleJwtError(error);
    }
  }
  async validateRefreshToken(tokenRefresh: string): Promise<TokenDto> {
    try {
      const data = jwt.verify(
        tokenRefresh,
        process.env.JWT_REFRESH_SECRET_KEY!,
      );
      // доп.проверки Токена
      if (typeof data !== 'object' || !('id' in data))
        throw ApiError.unauthorized('Неверный формат токена');
      const token = await this.findToken(tokenRefresh);
      if (!token) throw ApiError.notFound('Токен не найден в БД');
      if (
        !token.refreshTokenExpires ||
        token.refreshTokenExpires < new Date()
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
      const tokenAccess = jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET_KEY!,
        { expiresIn: +process.env.RESET_TOKEN_LIFETIME! },
      );
      const tokenRefresh = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET_KEY!,
        { expiresIn: +process.env.REFRESH_TOKEN_LIFETIME! },
      );
      return { tokenAccess, tokenRefresh };
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
    tokenRefresh: string,
    transaction?: Transaction,
  ): Promise<void> {
    // Хеширование Токена перед сохранением
    const hashedToken = this.hashToken(tokenRefresh);
    // срок Токена
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
      await tokenData.update(
        { refreshToken: hashedToken, refreshTokenExpires },
        { transaction },
      );
    } else {
      const smallestFreeId = await DatabaseUtils.getSmallestIDAvailable(
        'token',
        transaction,
      );
      await TokenModel.create(
        {
          id: smallestFreeId,
          userId,
          basketId,
          refreshToken: hashedToken,
          refreshTokenExpires,
        },
        { transaction },
      );
    }
  }

  // Поиск REFRESH токена в БД
  async findToken(tokenRefresh: string): Promise<TokenModel> {
    // Хеширование Токена перед поиском
    const hashedToken = this.hashToken(tokenRefresh);
    const token = await TokenModel.findOne({
      where: { refreshToken: hashedToken },
    });
    if (!token) throw ApiError.notFound('Токен не найден');
    if (token.refreshTokenExpires! < new Date()) {
      throw ApiError.unauthorized('Токен истёк');
    }
    return token;
  }

  // Удален.REFRESH из БД
  async removeToken(tokenRefresh: string): Promise<boolean> {
    const token = await this.findToken(tokenRefresh);
    if (!token) throw ApiError.notFound('Токен не найден для удаления');
    if (token.refreshTokenExpires && token.refreshTokenExpires < new Date())
      throw ApiError.unauthorized('Токен уже истёк');
    await token.destroy();
    return true;
  }
}

export default new TokenService();
