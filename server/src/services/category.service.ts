import CategoryModel from '../models/CategoryModel';
import { CategoryData } from '../types/catalog.interface';
import ApiError from '../middleware/errors/ApiError';

class CategoryService {
  async getOneCategory(id: number): Promise<CategoryModel> {
    const category = await CategoryModel.findByPk(id, {
      attributes: ['id', 'name'],
    });
    if (!category) throw ApiError.notFound('Категория не найдена');
    return category;
  }

  async getAllCategory(): Promise<CategoryData[]> {
    const categories = await CategoryModel.findAll({
      attributes: ['id', 'name'],
    });
    if (!categories) throw ApiError.notFound('Категории не найдены');
    return categories;
  }

  async createCategory(data: { name: string }): Promise<CategoryData> {
    const { name } = data;
    const exist = await CategoryModel.findOne({
      where: { name },
      attributes: ['id', 'name'],
    });
    if (exist) throw ApiError.conflict('Категория уже есть');
    const category = await CategoryModel.create({ name });
    if (!category) throw ApiError.notFound('Категория не создана');
    return this.getOneCategory(category.id);
  }

  async updateCategory(
    id: number,
    data: Partial<CategoryData>,
  ): Promise<CategoryData> {
    const category = await this.getOneCategory(id);
    await category.update(data);
    return this.getOneCategory(id);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.getOneCategory(id);
    await category.destroy();
  }
}

export default new CategoryService();
