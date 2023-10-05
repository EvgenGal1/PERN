// от ошб.повтор.объяв.перем в блоке
export {};

// подкл.конфиг.БД для записи получ.данн.в БД
const { pool } = require("../db");
const AppError = require("../error/ApiError");
const { Token } = require("../models/mapping");

// подкл.ф.контролера для генерац.web токена
const jwt = require("jsonwebtoken");

// fn генер.токена + Роль(по умолч.присвойка из User). по. Порядок - формат с fronta, back генер.,возвращ.токен, сохр на front(coocki,LS), front вход.на auth(в header добав.токен), back валид.по секрет.key
// const generateJwt = (payload) => {
//   // подписываем передан.парам.
//   return jwt.sign(
//     // payload(центр.часть токена) данн.польз.
//     // { id, username, email, role },
//     payload,
//     // проверка валид.ч/з секрет.ключ(в перем.окруж.)
//     process.env.JWT_ACCESS_SECRET_KEY,
//     // process.env.JWT_REFRESH_SECRET_KEY,
//     // опции
//     {
//       // вр.раб.токена
//       expiresIn: "30m",
//       // expiresIn: "30d",
//     }
//   );
// };

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
      // const userData = jwt.verify(token, process.env.SECRET_KEY);
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
      return userData;
    } catch (error) {
      return null;
    }
  }

  // генер.ACCESS и REFRESH токенов(`полезная нагрузка` прячется в токен)
  /* async */ generateToken(payload: any) {
    // const accessToken = generateJwt(payload); // ч/з fn генер.токена
    const accessToken = /* await */ jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    // const refreshToken = generateJwt(payload); // ч/з fn генер.токена
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
    const tokenData = await Token.findOne({
      where: { userId: userId /* , refreshToken: refreshToken */ },
    });

    // е/и нашлось перезапис refresh
    if (tokenData) {
      await Token.update(
        { refreshToken },
        { where: { userId: userId, basketId: basketId } }
      );
      tokenData.userId = userId;
      tokenData.refreshToken = refreshToken;

      // сохр. для обнов.в БД
      return tokenData.save();
    }

    // СОЗД.НОВ.ТОКЕН
    const token = await Token.create({
      userId: userId,
      basketId: basketId,
      refreshToken: refreshToken,
    });

    // возвращ.нов.токен
    return token;
  }

  // Удален.REFRESH из БД
  async removeToken(refreshToken: string) {
    const tokenData = await Token.destroy({
      where: { refreshToken: refreshToken },
    });

    return tokenData;
  }

  // Поиск REFRESH токена в БД
  async findToken(refreshToken: string) {
    const tokenData = await Token.findOne({
      where: { refreshToken: refreshToken },
    });

    return tokenData;
  }
}

export default new TokenService();
