import { BrandAttributes } from '../models/sequelize-types';
import ApiError from '../middleware/errors/ApiError';
import BrandModel from '../models/BrandModel';

// // ^ КЭШ
// import NodeCache from 'node-cache';
// const cache = new NodeCache({
//   stdTTL: 3600, // Время жизни данных в секундах (1 час)
//   checkperiod: 600, // Интервал проверки устаревших данных (10 минут)
//   maxKeys: 1000, // Максимальное количество ключей в кэше
// });

class BrandService {
  async getAllBrand() {
    return await BrandModel.findAll({
      attributes: ['id', 'name'],
    });
  }

  async getOneBrand(id: number) {
    // // ^ КЭШ
    // const cacheKey = `brand_${id}`;
    // const cachedBrand = cache.get(cacheKey);
    // if (cachedBrand) return cachedBrand;

    // ^ запрос ток нужного
    const brand = await BrandModel.findByPk(id, {
      attributes: ['id', 'name'],
    });
    if (!brand) throw ApiError.notFound('Бренд не найден');

    // // ^ КЭШ
    // cache.set(cacheKey, brand); // cохр.в кэш

    return brand;
  }

  async createBrand(data: BrandAttributes) {
    const { name } = data;
    const exist = await BrandModel.findOne({ where: { name } });
    if (exist) throw ApiError.conflict('Бренд уже есть');
    return await BrandModel.create({ name });
  }

  async updateBrand(id: number, data: Partial<BrandAttributes>) {
    const brand = await BrandModel.findByPk(id);
    if (!brand) throw ApiError.notFound('Бренд не найден');
    await brand.update(data);
    await brand.reload();
    return brand.get({ plain: true }) as BrandAttributes;
  }

  async deleteBrand(id: number) {
    const brand = await BrandModel.findByPk(id);
    if (!brand) throw ApiError.notFound('Бренд не найден');
    await brand.destroy();
    return { message: `Бренд '${brand.get('name')}' удален` };
  }
}

export default new BrandService();
