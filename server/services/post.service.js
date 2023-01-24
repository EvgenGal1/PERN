// ^ Service(Бизнес логика - БД и выход.парам.(НЕ req,res))

// подкл.конфиг.БД для записи получ.данн.в БД
const { pool } = require("../db");
const { Type } = require("../models/models");

class PostService {
  async createPost(post) {
    var onePost = await pool.query(`SELECT * FROM posts WHERE title = $1`, [
      post.title,
    ]);
    if (onePost.rows.length > 0) {
      return `Пост c Заголовком '${post.title}' уже есть`;
    }
    const newPost = await pool.query(
      `INSERT INTO posts (title, content, picture, userId) VALUES ($1, $2, $3, $4) RETURNING *`,
      [post.title, post.content, post.picture, post.userId]
    );
    return newPost.rows[0];
  }

  // async возрат поста по ID польз. в SQL запросе
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

  // ! НЕ РАБ - выгружает только пустой объ.
  async getAllPost() {
    const posts = await pool.query(`SELECT * FROM posts`);
    return posts.rows;
  }

  async getOnePost(id) {
    var onePost = await pool.query(`SELECT * FROM posts WHERE id =` + id);
    if (onePost.rows.length < 1) {
      return `Пост по ID ${id} не найден`;
    }
    return onePost.rows[0];
  }

  async updPost(post) {
    if (!post.id /* || post.id == Type.toString */) {
      return "ID не указан";
      // ! не раб. возвращ.1
      throw new Error("ID не указан");
    }
    var onePost = await pool.query(`SELECT * FROM posts WHERE id =` + post.id);
    if (onePost.rows.length < 1) {
      return `Пост по ID ${post.id} не найден`;
    }
    const updPost = await pool.query(
      `UPDATE posts SET title = $2 WHERE id = $1 RETURNING *`,
      [post.id, post.title /* , content, picture, userId */]
    );
    // if (updPost.rows.length < 1) {
    //   return `Пост по ID ${id} не найден`;
    // }
    return updPost.rows[0];
  }

  async delPost(id) {
    if (!id) {
      return "ID не указан";
      throw new Error("ID не указан");
    }
    var onePost = await pool.query(`SELECT * FROM posts WHERE id =` + id);
    if (onePost.rows.length < 1) {
      return `Пост по ID_${id} не найден`;
    }
    const delPost = await pool.query(`DELETE FROM posts WHERE id =` + id);
    return { message: `Удалён Пост по ID_${id}`, post: delPost.rows };
    return delPost.rows;
  }
}

// экспорт объ.данн.кл.
module.exports = new PostService();
// export default new PostService();
