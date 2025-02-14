import { BrandAttributes } from '../models/sequelize-types';
import ApiError from '../middleware/errors/ApiError';
import BrandModel from '../models/BrandModel';

class BrandService {
  async getAllBrand() {
    return await BrandModel.findAll();
  }

  async getOneBrand(id: number) {
    const brand = await BrandModel.findByPk(id);
    if (!brand) throw new ApiError(404, 'Бренд не найден');
    return brand;
  }

  async createBrand(data: BrandAttributes) {
    const { name } = data;
    const exist = await BrandModel.findOne({ where: { name } });
    if (exist) throw new ApiError(400, 'Бренд уже есть');
    return await BrandModel.create({ name });
  }

  async updateBrand(id: number, data: Partial<BrandAttributes>) {
    const brand = await BrandModel.findByPk(id);
    if (!brand) throw new ApiError(404, 'Бренд не найден');
    return await brand.update(data);
  }

  async deleteBrand(id: number) {
    const brand = await BrandModel.findByPk(id);
    if (!brand) throw new ApiError(404, 'Бренд не найден');
    await brand.destroy();
    return { message: `Бренд '${brand.get('name')}' удален` };
  }
}

export default new BrandService();
