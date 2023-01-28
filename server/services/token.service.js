// подкл.конфиг.БД для записи получ.данн.в БД
const { pool } = require("../db");
const { Token } = require("../models/models.js");

// подкл.ф.контролера для генерац.web токена
const jwt = require("jsonwebtoken");

// fn генер.токена + Роль(по умолч.присвойка из User). по. Порядок - формат с fronta, back генер.,возвращ.токен, сохр на front(coocki,LS), front вход.на auth(в header добав.токен), back валид.по секрет.key
const generateJwt = (payload) => {
  // подписываем передан.парам.
  return jwt.sign(
    // payload(центр.часть токена) данн.польз.
    // { id, username, email, role },
    payload,
    // проверка валид.ч/з секрет.ключ(в перем.окруж.)
    process.env.JWT_ACCESS_SECRET_KEY,
    // process.env.JWT_REFRESH_SECRET_KEY,
    // опции
    {
      // вр.раб.токена
      expiresIn: "30m",
      // expiresIn: "30d",
    }
  );
};

// сохр.токенов по id при регистр/логин
class TokenService {
  // генер.ACCESS и REFRESH токенов(`полезная нагрузка` прячется в токен)
  /* async */ generateToken(payload) {
    // передаём данн.польз в fn генер.токена.
    // const accessToken = generateJwt(payload);
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
      expiresIn: "30m",
    });
    // const refreshToken = generateJwt(payload);
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }

  // сохр.REFRESH токен в БД для польз.
  async saveToken(userId, refreshToken) {
    // проверка существ.токена перед сохр.в БД // ^ только для одного устр. Заход с др.устр. выбьет первое. Можно сохр по неск.токенов для польз.устр.(обнов.,удал.стар.токенов)
    const tokenData = await Token.findOne({ userId: userId });
    // е/и нашлось перезапис refresh
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      // сохр. для обнов.в БД
      return tokenData.save();
    }
    // СОЗД.НОВ.ТОКЕН
    const token = await Token.create({
      userId: userId,
      refreshToken: refreshToken,
    });
    // возвращ.нов.токен
    return token;
  }

  // генер.REFRESH

  // async createPost(post, picture) {
  //   // сохр.в перем.назв.изо ч/з FileService
  //   const fileName = FileService.saveFile(picture);
  //   var onePost = await pool.query(`SELECT * FROM posts WHERE title = $1`, [
  //     post.title,
  //   ]);
  //   if (onePost.rows.length > 0) {
  //     return `Пост c Заголовком '${post.title}' уже есть`;
  //   }
  //   const newPost = await pool.query(
  //     `INSERT INTO posts (title, content, picture, userId) VALUES ($1, $2, $3, $4) RETURNING *`,
  //     [post.title, post.content, /* post.picture */ fileName, post.userId]
  //   );
  //   return newPost.rows[0];
  // }
  // async getPostById(id, userId) {
  //   var varId;
  //   if (id) {
  //     var varId = await pool.query(`SELECT * FROM posts WHERE id =` + id);
  //   }
  //   if (userId) {
  //     var varId = await pool.query(
  //       `SELECT * FROM posts WHERE userId =` + userId
  //     );
  //   }
  //   if (varId.rows.length < 1) {
  //     if (id) {
  //       return `Пост по ID ${id} не найден`;
  //     }
  //     if (userId) {
  //       return `Посты у Пользователя с ID_${userId} не найдены`;
  //     }
  //   }
  //   return varId.rows /* .find() */;
  // }
  // async getAllPost() {
  //   const posts = await pool.query(`SELECT * FROM posts`);
  //   return posts.rows;
  // }
  // async getOnePost(id) {
  //   var onePost = await pool.query(`SELECT * FROM posts WHERE id =` + id);
  //   if (onePost.rows.length < 1) {
  //     return `Пост по ID ${id} не найден`;
  //   }
  //   return onePost.rows[0];
  // }
  // async updPost(post) {
  //   if (!post.id) {
  //     throw new Error("ID не указан");
  //     // return "ID не указан";
  //   }
  //   var onePost = await pool.query(`SELECT * FROM posts WHERE id =` + post.id);
  //   if (onePost.rows.length < 1) {
  //     return `Пост по ID ${post.id} не найден`;
  //   }
  //   const updPost = await pool.query(
  //     `UPDATE posts SET title = $2 WHERE id = $1 RETURNING *`,
  //     [post.id, post.title /* , content, picture, userId */]
  //   );
  //   return updPost.rows[0];
  // }
  // async delPost(id) {
  //   if (!id) {
  //     throw new Error("ID не указан");
  //     // return "ID не указан";
  //   }
  //   var onePost = await pool.query(`SELECT * FROM posts WHERE id =` + id);
  //   if (onePost.rows.length < 1) {
  //     return `Пост по ID_${id} не найден`;
  //   }
  //   const delPost = await pool.query(`DELETE FROM posts WHERE id =` + id);
  //   // return delPost.rows;
  //   return { message: `Удалён Пост по ID_${id}`, post: delPost.rows };
  // }
}

module.exports = new TokenService();
