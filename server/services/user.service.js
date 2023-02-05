// ^ Service(Бизнес логика - БД и выход.парам.(НЕ req,res))

// подкл.конфиг.БД для записи получ.данн.в БД
const { pool } = require("../db");
const FileService = require("./file.service.js");

// подкл.обраб.ошиб.
const ApiError = require("../error/ApiError");
// подкл.модели пользователей и ролей. Можно разнести на отдельн.ф(User.js,Role.js,..)
const { User } = require("../models/models");

class UserService {
  async getAllUserPERN() {
    const users = await User.findAndCountAll();
    return users;
  }

  async getOneUserPERN(id) {
    const userId = await User.findOne({ where: { id } });
    if (!userId) {
      return ApiError.BadRequest(`Пользователь с ID ${id} не найден`);
    }
    return userId;
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
