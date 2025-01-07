import AppError from '../middleware/errors/ApiError';
import { CategoryModel } from '../models/model';
import type { CategoryAttributes } from '../models/sequelize-types';

class CategoryService {
  async getAllCategory() {
    return await CategoryModel.findAll();
  }

  async getOneCategory(id: number) {
    const category = await CategoryModel.findByPk(id);
    if (!category) {
      throw new AppError(404, 'Категория не найдена');
    }
    return category;
  }

  async createCategory(data: { name: string }) {
    const { name } = data;
    const exist = await CategoryModel.findOne({ where: { name } });
    if (exist) throw new AppError(400, 'Категория уже есть');
    return await CategoryModel.create({ name });
  }

  async updateCategory(id: number, data: Partial<CategoryAttributes>) {
    const category = await CategoryModel.findByPk(id);
    if (!category) throw new AppError(404, 'Категория не найдена');
    return await category.update(data);
  }

  async deleteCategory(id: number) {
    const category = await CategoryModel.findByPk(id);
    if (!category) throw new AppError(404, 'Категория не найдена');
    await category.destroy();
    return { message: `Категория '${category.get('name')}' удалена` };
  }
}

export default new CategoryService();
