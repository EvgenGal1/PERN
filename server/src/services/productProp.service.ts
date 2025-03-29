// ^ servis для свойств Продукта

import ApiError from '../middleware/errors/ApiError';
import ProductModel from '../models/ProductModel';
import ProductPropModel from '../models/ProductPropModel';

class ProductPropService {
  async getAllProdProp(productId: number) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw ApiError.notFound('Продукт не найден');
    }
    const properties = await ProductPropModel.findAll({
      where: { productId },
      attributes: ['name', 'value'],
    });
    return properties;
  }

  async getOneProdProp(productId: number, id: number) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw ApiError.notFound('Продукт не найден');
    }
    const property = await ProductPropModel.findOne({
      where: { productId, id },
    });
    if (!property) {
      throw ApiError.notFound('Свойство Продукта не найдено');
    }
    return property;
  }

  async createProdProp(productId: number, data: any) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw ApiError.notFound('Продукт не найден');
    }
    const { name, value } = data;
    const property = await ProductPropModel.create({
      name,
      value,
      productId,
    });
    return property;
  }

  async updateProdProp(productId: number, id: number, data: any) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw ApiError.notFound('Продукт не найден');
    }
    const property = await ProductPropModel.findOne({
      where: { productId, id },
    });
    if (!property) {
      throw ApiError.notFound('Свойство Продукта не найдено');
    }
    const { name = property.get('name'), value = property.get('value') } = data;
    await property.update({ name, value });
    return property;
  }

  async deleteProdProp(productId: number, id: number | string) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw ApiError.notFound('Продукт не найден');
    }
    const property = await ProductPropModel.findOne({
      where: { productId, id },
    });
    if (!property) {
      throw ApiError.notFound('Свойство Продукта не найдено');
    }
    await property.destroy();
    return property;
  }
}

export default new ProductPropService();
