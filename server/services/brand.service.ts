import AppError from "../error/ApiError";
import { Brand as BrandMapping } from "../models/mapping";

class Brand {
  async getAllBrand() {
    const brands = await BrandMapping.findAll();
    return brands;
  }

  async getOneBrand(id) {
    const brand = await BrandMapping.findByPk(id);
    if (!brand) {
      throw new Error("Бренд не найден в БД");
    }
    return brand;
  }

  async createBrand(data) {
    const { name } = data;
    const brand = await BrandMapping.create({ name });
    return brand;
  }

  async updateBrand(id, data) {
    const brand = await BrandMapping.findByPk(id);
    if (!brand) {
      throw new Error("Бренд не найден в БД");
    }
    const { name = brand.name } = data;
    await brand.update({ name });
    return brand;
  }

  async deleteBrand(id) {
    const brand = await BrandMapping.findByPk(id);
    if (!brand) {
      throw new Error("Бренд не найден в БД");
    }
    await brand.destroy();
    return brand;
  }
}

export default new Brand();
