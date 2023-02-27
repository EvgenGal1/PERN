// от ошб.повтор.объяв.перем в блоке
export {};

// подкл.конфиг.БД для записи получ.данн.в БД
const { pool } = require("../db");
const ApiError = require("../error/ApiError.js");
const { Token } = require("../models/modelsTS.ts");

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
  validateAccessToken(token) {
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
  /* async */ generateToken(payload) {
    // передаём данн.польз в fn генер.токена.
    // const accessToken = generateJwt(payload);
    const accessToken = /* await */ jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: "12h",
      }
    );
    // const refreshToken = generateJwt(payload);
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
  async saveToken(userId: number, refreshToken: string) {
    console.log("===========================2 : " + refreshToken);
    // проверка существ.токена перед сохр.в БД // ^ только для одного устр. Заход с др.устр. выбьет первое. Можно сохр по неск.токенов для польз.устр.(обнов.,удал.стар.токенов)
    const tokenData = await Token.findOne({
      where: { userId: userId /* , refreshToken: refreshToken */ },
    });
    console.log("SRV.t.serv 3 : " + 3);
    // е/и нашлось перезапис refresh
    if (tokenData) {
      console.log("SRV.t.serv 4 : " + 4);
      /* const tokenUpd = */ await Token.update(
        { /* userId, */ refreshToken },
        { where: { userId: userId } }
      );
      return;
      tokenData.userId = userId;
      tokenData.refreshToken = refreshToken;
      // сохр. для обнов.в БД
      return tokenData.save();
    }
    console.log("SRV.t.serv 5 : " + 5);
    // СОЗД.НОВ.ТОКЕН
    const token = await Token.create({
      userId: userId,
      refreshToken: refreshToken,
    });
    console.log("SRV.t.serv 6 : " + 6);
    // возвращ.нов.токен
    return token;
  }

  // Удален.REFRESH из БД
  async removeToken(refreshToken) {
    console.log("SRV.t.serv 7 : " + 7);
    const tokenData = await Token.destroy({
      where: { refreshToken: refreshToken },
    });
    return tokenData;
  }

  // Поиск REFRESH токена в БД
  async findToken(refreshToken) {
    console.log("SRV.t.serv 8 : " + 8);
    const tokenData = await Token.findOne({
      where: { refreshToken: refreshToken },
    });
    console.log("tokenData : " + tokenData);
    return tokenData;
  }
}

module.exports = new TokenService();
