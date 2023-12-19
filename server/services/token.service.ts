import { Token as TokenModel } from "../models/model";
import AppError from "../error/ApiError";
import DatabaseUtils from "../utils/database.utils";

// подкл.ф.контролера для генерац.web токена
const jwt = require("jsonwebtoken");

// сохр.токенов по id при регистр/логин
class TokenService {
  // валид./проверка подделки/сроки жизни токена ACCESS и REFRESH
  validateAccessToken(token: string) {
    try {
      // верифик.|раскодир.токен. `проверять` на валидность(токен, секр.ключ)
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
      return userData;
    } catch (error) {
      return null;
    }
  }
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
      return userData;
    } catch (error) {
      return null;
    }
  }

  // генер.ACCESS и REFRESH токенов(`полезная нагрузка` прячется в токен)
  /* async */ generateToken(payload: any) {
    const accessToken = /* await */ jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    const refreshToken = /* await */ jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    return { accessToken, refreshToken };
  }

  // сохр.REFRESH токен в БД для польз.
  async saveToken(userId: number, basketId: number, refreshToken: string) {
    // проверка существ.токена перед сохр.в БД
    // ^ только для одного устр. Заход с др.устр. выбьет первое. Можно сохр по неск.токенов для польз.устр.(обнов.,удал.стар.токенов)
    const tokenData = await TokenModel.findOne({
      where: { userId: userId /* , refreshToken: refreshToken */ },
    });

    // е/и нашлось перезапис refresh
    if (tokenData) {
      await TokenModel.update(
        { refreshToken },
        { where: { userId: userId, basketId: basketId } }
      );
      tokenData.userId = userId;
      tokenData.refreshToken = refreshToken;

      // сохр. для обнов.в БД
      return tokenData.save();
    }

    // `получить наименьший доступный идентификатор` из табл.БД
    const smallestFreeId = await DatabaseUtils.getSmallestIDAvailable("user");

    // СОЗД.НОВ.ТОКЕН
    const token = await TokenModel.create({
      id: smallestFreeId,
      userId: userId,
      basketId: basketId,
      refreshToken: refreshToken,
    });

    // возвращ.нов.токен
    return token;
  }

  // Удален.REFRESH из БД
  async removeToken(refreshToken: string) {
    const tokenData = await TokenModel.destroy({
      where: { refreshToken: refreshToken },
    });

    return tokenData;
  }

  // Поиск REFRESH токена в БД
  async findToken(refreshToken: string) {
    const tokenData = await TokenModel.findOne({
      where: { refreshToken: refreshToken },
    });

    return tokenData;
  }
}

export default new TokenService();
