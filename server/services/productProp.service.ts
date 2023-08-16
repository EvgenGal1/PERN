// ^ servis для свойств товара
import AppError from "../error/ApiError";
import { Product as ProductMapping } from "../models/mapping";
import { ProductProp as ProductPropMapping } from "../models/mapping";

class ProductProp {
  async getAll(productId) {
    const product = await ProductMapping.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const properties = await ProductPropMapping.findAll({
      where: { productId },
    });
    return properties;
  }

  async getOne(productId, id) {
    const product = await ProductMapping.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const property = await ProductPropMapping.findOne({
      where: { productId, id },
    });
    if (!property) {
      throw new Error("Свойство товара не найдено в БД");
    }
    return property;
  }

  async create(productId, data) {
    console.log("PP -- 135 : " + 135);
    console.log("PP -- productId : " + productId);
    console.log(productId);
    console.log("PP -- data : " + data);
    console.log(data);
    const product = await ProductMapping.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    console.log("PP -- product : " + product);
    console.log(product);
    const { name, value } = data;
    console.log("PP -- name : " + name);
    console.log(name);
    console.log("PP -- value : " + value);
    console.log(value);
    const property = await ProductPropMapping.create({
      name,
      value,
      productId,
    });
    console.log("PP -- 567 : " + 567);
    return property;
  }

  async update(productId, id, data) {
    const product = await ProductMapping.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const property = await ProductPropMapping.findOne({
      where: { productId, id },
    });
    if (!property) {
      throw new Error("Свойство товара не найдено в БД");
    }
    const { name = property.name, value = property.value } = data;
    await property.update({ name, value });
    return property;
  }

  async delete(productId, id: number | string) {
    const product = await ProductMapping.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const property = await ProductPropMapping.findOne({
      where: { productId, id },
    });
    if (!property) {
      throw new Error("Свойство товара не найдено в БД");
    }
    await property.destroy();
    return property;
  }
}

export default new ProductProp();
