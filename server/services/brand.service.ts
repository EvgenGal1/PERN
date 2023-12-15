import AppError from "../error/ApiError";
import { Brand as BrandModel } from "../models/model";

class BrandService {
  async getAllBrand() {
    const brands = await BrandModel.findAll();
    return brands;
  }

  async getOneBrand(id) {
    const brand = await BrandModel.findByPk(id);
    if (!brand) {
      throw new Error("Бренд не найден в БД");
    }
    return brand;
  }

  async createBrand(data) {
    const { name } = data;
    const exist = await BrandModel.findOne({ where: { name } });
    if (exist) {
      throw new Error("Бренд уже есть");
    }
    const brand = await BrandModel.create({ name });
    return brand;
  }

  async updateBrand(id, data) {
    const brand = await BrandModel.findByPk(id);
    if (!brand) {
      throw new Error("Бренд не найден в БД");
    }
    const { name = brand.name } = data;
    await brand.update({ name });
    return brand;
  }

  async deleteBrand(id) {
    const brand = await BrandModel.findByPk(id);
    if (!brand) {
      throw new Error("Бренд не найден в БД");
    }
    await brand.destroy();
    return brand;
  }
}

export default new BrandService();
