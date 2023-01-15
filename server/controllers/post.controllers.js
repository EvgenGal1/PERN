// fn|запросы по созданию постов для польз.

// подкл.конфиг.БД для записи получ.данн.в БД
const db = require("../db");

// обьяв.кл.(для компановки) с неск.мтд
class PostControllers {
  // async созд.поста по SQL запросу ВСТАВКИ, проверки
  async createPost(req, res) {
    // базов.логика с обраб.ошб.
    try {
      // получ.данн.с fronta
      const { title, content, userId } = req.body;
      // async созд.поста с пропис.SQL запросом
      const newPost = await db.query(
        `INSERT INTO post (title, content, userId) VALUES ($1, $2, $3) RETURNING *`,
        [title, content, userId]
      );
      // возвращ.только пост(rows) на front
      res.json(newPost.rows[0]);
    } catch (error) {
      const { title, content, userId } = req.body;
      // общ.отв. на серв.ошб. в json смс
      res.status(500).json({
        // , ${password}
        message: `Не удалось добавить Пост - ${title}. ${content}, ${userId}`,
      });
    }
  }

  // async возрат поста по ID польз. в SQL запросе
  async getPostByUser(req, res) {
    try {
      // ID получ.из query(не params). Это не часть стр.запроса, а отдел.query парам. указывающийся после вопрос.знака в адресе/пути Postman|Брайзер (http://localhost:5005/PERN/post?id=5)
      const id = req.query.id;
      const allUser = await db.query(`SELECT * FROM post WHERE userId = $1`, [
        id,
      ]);
      // возвращ. весь массив (по факту только по id)
      res.json(allUser.rows);
    } catch (error) {}
  }
}

// экспорт объ.кл.
module.exports = new PostControllers();
