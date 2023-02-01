// подкл.конфиг.БД для записи получ.данн.в БД
const { pool } = require("../db");
const { Token } = require("../models/models.js");

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
  // генер.ACCESS и REFRESH токенов(`полезная нагрузка` прячется в токен)
  /* async */ generateToken(payload) {
    // передаём данн.польз в fn генер.токена.
    // const accessToken = generateJwt(payload);
    const accessToken = /* await */ jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: "30m",
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
  async saveToken(userId, refreshToken) {
    // проверка существ.токена перед сохр.в БД // ^ только для одного устр. Заход с др.устр. выбьет первое. Можно сохр по неск.токенов для польз.устр.(обнов.,удал.стар.токенов)
    const tokenData = await Token.findOne({ id: userId });
    // е/и нашлось перезапис refresh
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      // сохр. для обнов.в БД
      return tokenData.save();
    }
    // СОЗД.НОВ.ТОКЕН
    const token = await Token.create({
      id: userId,
      refreshToken: refreshToken,
    });
    // возвращ.нов.токен
    return token;
  }
}

module.exports = new TokenService();
