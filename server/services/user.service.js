// ^ Service(Бизнес логика - БД и выход.парам.(НЕ req,res))

// подкл.конфиг.БД для записи получ.данн.в БД
const { pool } = require("../db");
const FileService = require("./file.service.js");

// подкл.модели пользователей и ролей. Можно разнести на отдельн.ф(User.js,Role.js,..)
const { User } = require("../models/models");
// подкл.обраб.ошиб.
const ApiError = require("../error/ApiError");

class UserService {
  async createPost(post, picture) {
    // сохр.в перем.назв.изо ч/з FileService
    const fileName = FileService.saveFile(picture);
    var onePost = await pool.query(`SELECT * FROM posts WHERE title = $1`, [
      post.title,
    ]);
    if (onePost.rows.length > 0) {
      return `Пост c Заголовком '${post.title}' уже есть`;
    }
    const newPost = await pool.query(
      `INSERT INTO posts (title, content, picture, userId) VALUES ($1, $2, $3, $4) RETURNING *`,
      [post.title, post.content, /* post.picture */ fileName, post.userId]
    );
    return newPost.rows[0];
  }

  async getPostById(id, userId) {
    var varId;
    if (id) {
      var varId = await pool.query(`SELECT * FROM posts WHERE id =` + id);
    }
    if (userId) {
      var varId = await pool.query(
        `SELECT * FROM posts WHERE userId =` + userId
      );
    }
    if (varId.rows.length < 1) {
      if (id) {
        return `Пост по ID ${id} не найден`;
      }
      if (userId) {
        return `Посты у Пользователя с ID_${userId} не найдены`;
      }
    }
    return varId.rows /* .find() */;
  }

  async getUserPERN() {
    const users = await User.findAll();
    return users;
  }

  async getOneUserPERN(id) {
    var onePost = await pool.query(`SELECT * FROM posts WHERE id =` + id);
    if (onePost.rows.length < 1) {
      return `Пост по ID ${id} не найден`;
    }
    return onePost.rows[0];
  }

  async updateUserPERN(post) {
    if (!post.id) {
      throw new Error("ID не указан");
      // return "ID не указан";
    }
    var onePost = await pool.query(`SELECT * FROM posts WHERE id =` + post.id);
    if (onePost.rows.length < 1) {
      return `Пост по ID ${post.id} не найден`;
    }
    const updPost = await pool.query(
      `UPDATE posts SET title = $2 WHERE id = $1 RETURNING *`,
      [post.id, post.title /* , content, picture, userId */]
    );
    return updPost.rows[0];
  }

  async deleteUserPERN(id) {
    if (!id) {
      throw new Error("ID не указан");
      // return "ID не указан";
    }
    var onePost = await pool.query(`SELECT * FROM posts WHERE id =` + id);
    if (onePost.rows.length < 1) {
      return `Пост по ID_${id} не найден`;
    }
    const delPost = await pool.query(`DELETE FROM posts WHERE id =` + id);
    // return delPost.rows;
    return { message: `Удалён Пост по ID_${id}`, post: delPost.rows };
  }
}

module.exports = new UserService();
