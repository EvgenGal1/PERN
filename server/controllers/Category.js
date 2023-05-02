class Category {
  async getAll(req, res) {
    res.status(200).send("Список всех категорий");
  }

  async getOne(req, res) {
    res.status(200).send("Получение одной категории");
  }

  async create(req, res) {
    res.status(200).send("Создание новой категории");
  }

  async update(req, res) {
    res.status(200).send("Обновление категории");
  }

  async delete(req, res) {
    res.status(200).send("Удаление категории");
  }
}

export default new Category();
