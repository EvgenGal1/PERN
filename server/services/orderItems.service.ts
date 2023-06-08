// ^ servis для свойств товара
import AppError from "../error/ApiError";
import { Order as OrderMapping } from "../models/mapping";
import { OrderItem as OrderItemMapping } from "../models/mapping";

class OrderItem {
  async getAll(orderId) {
    const order = await OrderMapping.findByPk(orderId);
    if (!order) {
      throw new Error("Товар не найден в БД");
    }
    const items = await OrderItemMapping.findAll({
      where: { orderId },
    });
    return items;
  }

  async getOne(orderId, id) {
    const order = await OrderMapping.findByPk(orderId);
    if (!order) {
      throw new Error("Товар не найден в БД");
    }
    const item = await OrderItemMapping.findOne({
      where: { orderId, id },
    });
    if (!item) {
      throw new Error("Свойство товара не найдено в БД");
    }
    return item;
  }

  async create(orderId, data) {
    const order = await OrderMapping.findByPk(orderId);
    if (!order) {
      throw new Error("Товар не найден в БД");
    }
    const { name, value } = data;
    const item = await OrderItemMapping.create({
      name,
      value,
      orderId,
    });
    return item;
  }

  async update(orderId, id, data) {
    const order = await OrderMapping.findByPk(orderId);
    if (!order) {
      throw new Error("Товар не найден в БД");
    }
    const item = await OrderItemMapping.findOne({
      where: { orderId, id },
    });
    if (!item) {
      throw new Error("Свойство товара не найдено в БД");
    }
    const { name = item.name, value = item.value } = data;
    await item.update({ name, value });
    return item;
  }

  async delete(orderId, id: number | string) {
    const order = await OrderMapping.findByPk(orderId);
    if (!order) {
      throw new Error("Товар не найден в БД");
    }
    const item = await OrderItemMapping.findOne({
      where: { orderId, id },
    });
    if (!item) {
      throw new Error("Свойство товара не найдено в БД");
    }
    await item.destroy();
    return item;
  }
}

export default new OrderItem();
