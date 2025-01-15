// ^ servis для свойств товара

import ProductModel from '../models/ProductModel';
import ProductPropModel from '../models/ProductPropModel';

class ProductPropService {
  async getAllProdProp(productId: number) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw new Error('Товар не найден в БД');
    }
    const properties = await ProductPropModel.findAll({
      where: { productId },
    });
    return properties;
  }

  async getOneProdProp(productId: number, id: number) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw new Error('Товар не найден в БД');
    }
    const property = await ProductPropModel.findOne({
      where: { productId, id },
    });
    if (!property) {
      throw new Error('Свойство товара не найдено в БД');
    }
    return property;
  }

  async createProdProp(productId: number, data: any) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw new Error('Товар не найден в БД');
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
      throw new Error('Товар не найден в БД');
    }
    const property = await ProductPropModel.findOne({
      where: { productId, id },
    });
    if (!property) {
      throw new Error('Свойство товара не найдено в БД');
    }
    const { name = property.get('name'), value = property.get('value') } = data;
    await property.update({ name, value });
    return property;
  }

  async deleteProdProp(productId: number, id: number | string) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw new Error('Товар не найден в БД');
    }
    const property = await ProductPropModel.findOne({
      where: { productId, id },
    });
    if (!property) {
      throw new Error('Свойство товара не найдено в БД');
    }
    await property.destroy();
    return property;
  }
}

export default new ProductPropService();
