import AppError from '../middleware/errors/ApiError';
import { CategoryModel } from '../models/model';
import type { CategoryAttributes } from '../models/sequelize-types';

class CategoryService {
  async getAllCategory() {
    const categories = await CategoryModel.findAll();
    return categories;
  }

  async getOneCategory(id: number) {
    const category = await CategoryModel.findByPk(id);
    if (!category) {
      throw new Error('Категория не найдена в БД');
    }
    return category;
  }

  async createCategory(data: { name: string }) {
    const { name } = data;
    const exist = await CategoryModel.findOne({ where: { name } });
    if (exist) {
      throw new Error('Категория уже есть');
    }
    const category = await CategoryModel.create({ name });
    return category;
  }

  async updateCategory(id: number, data: Partial<CategoryAttributes>) {
    const category = await CategoryModel.findByPk(id);
    if (!category) {
      throw new Error('Категория не найдена в БД');
    }
    const name: string =
      typeof data.name === 'string'
        ? data.name
        : (category.get('name') as string);
    await category.update({ name });
    return category;
  }

  async deleteCategory(id: number) {
    const category = await CategoryModel.findByPk(id);
    if (!category) {
      throw new Error('Категория не найдена в БД');
    }
    await category.destroy();
    return category;
  }
}

export default new CategoryService();
