import AppError from "../error/ApiError";
import { Category as CategoryMapping } from "../models/mapping";

class Category {
  async getAllCategory() {
    const categories = await CategoryMapping.findAll();
    return categories;
  }

  async getOneCategory(id) {
    const category = await CategoryMapping.findByPk(id);
    if (!category) {
      throw new Error("Категория не найдена в БД");
    }
    return category;
  }

  async createCategory(data) {
    const { name } = data;
    const exist = await CategoryMapping.findOne({ where: { name } });
    if (exist) {
      throw new Error("Такая категория уже есть");
    }
    const category = await CategoryMapping.create({ name });
    return category;
  }

  async updateCategory(id, data) {
    const category = await CategoryMapping.findByPk(id);
    if (!category) {
      throw new Error("Категория не найдена в БД");
    }
    const { name = category.name } = data;
    await category.update({ name });
    return category;
  }

  async deleteCategory(id) {
    const category = await CategoryMapping.findByPk(id);
    if (!category) {
      throw new Error("Категория не найдена в БД");
    }
    await category.destroy();
    return category;
  }
}

export default new Category();
