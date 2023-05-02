class Brand {
  async getAll(req, res) {
    res.status(200).send("Список всех брендов");
  }

  async getOne(req, res) {
    res.status(200).send("Получение одного бренда");
  }

  async create(req, res) {
    res.status(200).send("Создание нового бренда");
  }

  async update(req, res) {
    res.status(200).send("Обновление бренда");
  }

  async delete(req, res) {
    res.status(200).send("Удаление бренда");
  }
}

export default new Brand();
