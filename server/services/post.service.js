class Service {
  async createPost(req, res) {
    // базов.логика с обраб.ошб.
    try {
      // return res.json(["123"]);
      // получ.данн.с fronta
      const { title, content, picture, userId } = req.body;
      // async созд.поста с пропис.SQL запросом
      const newPost = await pool.query(
        `INSERT INTO post (title, content, picture, userId) VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, content, picture, userId]
      );
      // возвращ.только пост(rows) на front
      res.json(newPost.rows[0]);
    } catch (error) {
      const { title, content, picture, userId } = req.body;
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
      const allUser = await pool.query(`SELECT * FROM post WHERE userId = $1`, [
        id,
      ]);
      // возвращ. весь массив (по факту только по id)
      res.json(allUser.rows);
    } catch (error) {}
  }
}

// экспорт объ.данн.кл.
export default new Service();
