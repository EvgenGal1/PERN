import { BrandAttributes } from 'models/sequelize-types';
import AppError from '../middleware/errors/ApiError';
import { BrandModel } from '../models/model';

class BrandService {
  async getAllBrand() {
    const brands = await BrandModel.findAll();
    return brands;
  }

  async getOneBrand(id: number) {
    const brand = await BrandModel.findByPk(id);
    if (!brand) {
      throw new Error('Бренд не найден в БД');
    }
    return brand;
  }

  async createBrand(data: any) {
    const { name } = data;
    const exist = await BrandModel.findOne({ where: { name } });
    if (exist) {
      throw new Error('Бренд уже есть');
    }
    const brand = await BrandModel.create({ name });
    return brand;
  }

  async updateBrand(id: number, data: { name?: string }) {
    const brand = await BrandModel.findByPk(id);
    if (!brand) {
      throw new Error('Бренд не найден в БД');
    }
    const { name = brand.get('name') as string } = data;
    // const { name = (brand as unknown as BrandAttributes).name } = data;
    // const { name = (brand as BrandAttributes).name } = data;
    await brand.update({ name });
    return brand;
  }

  async deleteBrand(id: number) {
    const brand = await BrandModel.findByPk(id);
    if (!brand) {
      throw new Error('Бренд не найден в БД');
    }
    await brand.destroy();
    return brand;
  }
}

export default new BrandService();
