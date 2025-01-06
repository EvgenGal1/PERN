// ^ servis для свойств товара
import { OrderItemAttributes } from 'models/sequelize-types';
import AppError from '../middleware/errors/ApiError';
import { OrderModel } from '../models/model';
import { OrderItemModel } from '../models/model';
import sequelize from 'sequelize';

class OrderItemService {
  async getAllOrderItems(orderId: number): Promise<OrderItemAttributes[]> {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw new Error('Товар не найден в БД');
    }
    const items: OrderItemAttributes[] = (
      await OrderItemModel.findAll({
        where: { id: orderId },
      })
    ).map((item) => item.get({ plain: true }));
    return items;
  }

  async getOneOrderItems(orderId: number, id: number) {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw new Error('Товар не найден в БД');
    }
    const item = await OrderItemModel.findOne({
      where: { id: id /* , orderId: orderId  */ },
      include: [{ model: OrderModel, as: 'order', where: { id: orderId } }],
    });
    if (!item) {
      throw new Error('Свойство товара не найдено в БД');
    }
    return item.get({ plain: true }) as OrderItemAttributes;
  }

  async createOrderItems(
    orderId: number,
    data: any,
  ): Promise<OrderItemAttributes> {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw new Error('Товар не найден в БД');
    }
    const { name, price, quantity } = data;
    const item = await OrderItemModel.create(
      {
        name,
        price,
        quantity,
        orderId,
        // orderId: order.get('id'), // Используем order.get('id') для связи
        // orderId: sequelize.literal(orderId.toString()), // Используем sequelize.literal для связи
        // orderId: sequelize.literal(`${orderId}`), // Используем sequelize.literal для связи
        // orderId: orderId, // Используем orderId напрямую
        // orderId: sequelize.literal(orderId.toString()), // Используем sequelize.literal для связи
      } /* as any */,
    ); // Приведение типа для обхода ошибки
    return item.get({ plain: true }) as OrderItemAttributes;
  }

  async updateOrderItems(
    orderId: number,
    id: number,
    data: any,
  ): Promise<OrderItemAttributes> {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw new Error('Товар не найден в БД');
    }
    const item = await OrderItemModel.findOne({
      where: { id: id /* , orderId: orderId */ },
      include: [{ model: OrderModel, as: 'order', where: { id: orderId } }],
    });
    if (!item) {
      throw new Error('Свойство товара не найдено в БД');
    }

    // статус
    // let status /* : number */ = order.get('status');
    let status: number = order.get('status') as number; // Приведение типа для status
    if (
      data.name !== item.get('name') ||
      data.price !== item.get('price') ||
      data.quantity !== item.get('quantity')
    ) {
      if (status === 2001 || status === 2003) {
        status = 2003;
      } else {
        status = 2002;
      }
      await order.update({ status });
    }

    const {
      name = item.get('name'),
      price = item.get('price'),
      quantity = item.get('quantity'),
    } = data;
    await item.update({ name, price, quantity });
    return item.get({ plain: true }) as OrderItemAttributes;
  }

  async deleteOrderItems(orderId: number, id: number | string) {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw new Error('Товар не найден в БД');
    }
    const item = await OrderItemModel.findOne({
      where: { /* orderId, */ id },
      include: [{ model: OrderModel, as: 'order', where: { id: orderId } }],
    });
    if (!item) {
      throw new Error('Свойство товара не найдено в БД');
    }
    await item.destroy();
    return item;
  }
}

export default new OrderItemService();
