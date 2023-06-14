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
    console.log("SRV ord ITM.serv CRA data - 0111 : " + data);
    console.log(data);
    const order = await OrderMapping.findByPk(orderId);
    if (!order) {
      throw new Error("Товар не найден в БД");
    }
    const { name, price, quantity } = data;
    const item = await OrderItemMapping.create({
      name,
      price,
      quantity,
      orderId,
    });
    return item;
  }

  async update(orderId, id, data) {
    console.log("SRV ord ITM.serv UPD orderId - 0111 : " + orderId);
    console.log("SRV ord ITM.serv UPD id - 0111 : " + id);
    console.log("SRV ord ITM.serv UPD data - 0111 : " + data);
    console.log(data);

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
    const {
      name = item.name,
      price = item.price,
      quantity = item.price,
    } = data;
    await item.update({ name, price, quantity });
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
