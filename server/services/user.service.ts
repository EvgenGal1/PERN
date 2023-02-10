// ^ Service(Бизнес логика - БД и выход.парам.(НЕ req,res))

// от ошб.повтор.объяв.перем в блоке
export {};

// подкл.конфиг.БД для записи получ.данн.в БД
const { pool } = require("../db");
const FileService = require("./file.service.ts");

// подкл.обраб.ошиб.
const ApiError = require("../error/ApiError");
// подкл.модели пользователей и ролей. Можно разнести на отдельн.ф(User.ts,Role.ts,..)
const { User } = require("../models/modelsTS.ts");

class UserService {
  async getAllUserPERN() {
    const users = await User.findAll(); // findAndCountAll в ошб.
    return users;
  }

  async getOneUserPERN(id: number) {
    const userId = await User.findOne({ where: { id } });
    if (!userId) {
      return ApiError.BadRequest(`Пользователь с ID ${id} не найден`);
    }
    return userId;
  }

  async updateUserPERN(id: number, username: string, title: string) {
    if (!id) {
      throw new Error("ID не указан");
      // return "ID не указан";
    }
    var onePost = await pool.query(`SELECT * FROM posts WHERE id =` + id);
    if (onePost.rows.length < 1) {
      return `Пост по ID ${id} не найден`;
    }
    const updPost = await pool.query(
      `UPDATE posts SET title = $2 WHERE id = $1 RETURNING *`,
      [id, title /* , content, picture, userId */]
    );
    return updPost.rows[0];
  }

  async deleteUserPERN(id: number) {
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
