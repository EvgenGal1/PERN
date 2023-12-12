// ^ servis для свойств товара
import AppError from "../error/ApiError";
import { Product as ProductModel } from "../models/model";
import { ProductProp as ProductPropModel } from "../models/model";

class ProductPropService {
  async getAllProdProp(productId) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const properties = await ProductPropModel.findAll({
      where: { productId },
    });
    return properties;
  }

  async getOneProdProp(productId, id) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const property = await ProductPropModel.findOne({
      where: { productId, id },
    });
    if (!property) {
      throw new Error("Свойство товара не найдено в БД");
    }
    return property;
  }

  async createProdProp(productId, data) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const { name, value } = data;
    const property = await ProductPropModel.create({
      name,
      value,
      productId,
    });
    return property;
  }

  async updateProdProp(productId, id, data) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const property = await ProductPropModel.findOne({
      where: { productId, id },
    });
    if (!property) {
      throw new Error("Свойство товара не найдено в БД");
    }
    const { name = property.name, value = property.value } = data;
    await property.update({ name, value });
    return property;
  }

  async deleteProdProp(productId, id: number | string) {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const property = await ProductPropModel.findOne({
      where: { productId, id },
    });
    if (!property) {
      throw new Error("Свойство товара не найдено в БД");
    }
    await property.destroy();
    return property;
  }
}

export default new ProductPropService();
