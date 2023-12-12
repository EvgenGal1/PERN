// ^ servis для свойств товара
import AppError from "../error/ApiError";
import { Order as OrderModel } from "../models/model";
import { OrderItem as OrderItemModel } from "../models/model";

class OrderItemService {
  async getAllOrderItems(orderId) {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw new Error("Товар не найден в БД");
    }
    const items = await OrderItemModel.findAll({
      where: { orderId },
    });
    return items;
  }

  async getOneOrderItems(orderId, id) {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw new Error("Товар не найден в БД");
    }
    const item = await OrderItemModel.findOne({
      where: { orderId, id },
    });
    if (!item) {
      throw new Error("Свойство товара не найдено в БД");
    }
    return item;
  }

  async createOrderItems(orderId, data) {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw new Error("Товар не найден в БД");
    }
    const { name, price, quantity } = data;
    const item = await OrderItemModel.create({
      name,
      price,
      quantity,
      orderId,
    });
    return item;
  }

  async updateOrderItems(orderId, id, data) {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw new Error("Товар не найден в БД");
    }
    const item = await OrderItemModel.findOne({
      where: { orderId, id },
    });
    console.log("ITM data : " + data);
    console.log(data);
    console.log("ITM item : " + item);
    console.log(item);
    if (!item) {
      throw new Error("Свойство товара не найдено в БД");
    }

    // статус
    let status: number = order.status;
    if (
      data.name !== item.name ||
      data.price !== item.price ||
      data.quantity !== item.quantity
    ) {
      if (status === 2001 || status === 2003) {
        status = 2003;
      } else {
        status = 2002;
      }
      await order.update({
        status,
      });
    }

    const {
      name = item.name,
      price = item.price,
      quantity = item.quantity,
    } = data;
    await item.update({ name, price, quantity });
    return item;
  }

  async deleteOrderItems(orderId, id: number | string) {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw new Error("Товар не найден в БД");
    }
    const item = await OrderItemModel.findOne({
      where: { orderId, id },
    });
    if (!item) {
      throw new Error("Свойство товара не найдено в БД");
    }
    await item.destroy();
    return item;
  }
}

export default new OrderItemService();
