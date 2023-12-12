import AppError from "../error/ApiError";
import { Category as CategoryModel } from "../models/model";

class CategoryService {
  async getAllCategory() {
    const categories = await CategoryModel.findAll();
    return categories;
  }

  async getOneCategory(id) {
    const category = await CategoryModel.findByPk(id);
    if (!category) {
      throw new Error("Категория не найдена в БД");
    }
    return category;
  }

  async createCategory(data) {
    const { name } = data;
    const exist = await CategoryModel.findOne({ where: { name } });
    if (exist) {
      throw new Error("Такая категория уже есть");
    }
    const category = await CategoryModel.create({ name });
    return category;
  }

  async updateCategory(id, data) {
    const category = await CategoryModel.findByPk(id);
    if (!category) {
      throw new Error("Категория не найдена в БД");
    }
    const { name = category.name } = data;
    await category.update({ name });
    return category;
  }

  async deleteCategory(id) {
    const category = await CategoryModel.findByPk(id);
    if (!category) {
      throw new Error("Категория не найдена в БД");
    }
    await category.destroy();
    return category;
  }
}

export default new CategoryService();
