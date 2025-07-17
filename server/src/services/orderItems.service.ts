// ^ servis для Позиций Заказа

import { Transaction } from 'sequelize';

import OrderModel from '../models/OrderModel';
import OrderItemModel from '../models/OrderItemModel';
import type { OrderItemAttributes } from '../models/sequelize-types';
import { OrderItemCreateDto } from '../types/order_item.interface';
import ApiError from '../middleware/errors/ApiError';
import DatabaseUtils from '../utils/database.utils';

class OrderItemService {
  async getAllOrderItems(orderId: number): Promise<OrderItemAttributes[]> {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw ApiError.notFound('Позиция не найден');
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
      throw ApiError.notFound('Позиция не найден');
    }
    const item = await OrderItemModel.findOne({
      where: { id: id /* , orderId: orderId  */ },
      include: [{ model: OrderModel, as: 'order', where: { id: orderId } }],
    });
    if (!item) {
      throw ApiError.notFound('Позиция Заказа не найдена');
    }
    return item.get({ plain: true }) as OrderItemAttributes;
  }

  /**
   * созд. Одну Позицию Заказа
   * @param orderId - ID Заказа
   * @param data - данн. Позиции
   */
  async createOrderItems(
    orderId: number,
    data: any,
    transaction?: Transaction,
  ): Promise<OrderItemAttributes> {
    const order = await OrderModel.findByPk(orderId, { transaction });
    if (!order) {
      throw ApiError.notFound('Заказ не найден');
    }
    const { name, price, quantity } = data;
    const item = await OrderItemModel.create({
      name,
      price,
      quantity,
      orderId,
    });
    return item.get({ plain: true }) as OrderItemAttributes;
  }

  /**
   * созд. Несколько Позиций Заказа
   * @param orderId - ID Заказа
   * @param items - масс. Позиций
   * @param transaction - Транзакция
   */
  async createOrderItemsBatch(
    orderId: number,
    items: OrderItemCreateDto[],
    transaction?: Transaction,
  ): Promise<void> {
    // получ. наименьший ID Позиций
    const startId = await DatabaseUtils.getSmallestIDAvailable(
      'order_item',
      transaction,
    );

    // созд. Позиции Заказа с послед.ID
    await Promise.all(
      items.map((item, index) =>
        OrderItemModel.create(
          {
            id: startId + index,
            orderId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          },
          { transaction },
        ),
      ),
    );
  }

  /**
   * обнов. Позиций Заказа
   * @param orderId - ID Заказа
   * @param itemId - ID Позиции
   * @param data - объ. Позиций для изменения
   */
  async updateOrderItems(
    orderId: number,
    itemId: number,
    data: OrderItemCreateDto,
  ): Promise<OrderItemAttributes> {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw ApiError.notFound('Заказ не найден');
    }
    const item = await OrderItemModel.findOne({
      where: { id: itemId /* , orderId: orderId */ },
      include: [{ model: OrderModel, as: 'order', where: { id: orderId } }],
    });
    if (!item) {
      throw ApiError.notFound('Позиция Заказа не найдено');
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
      throw ApiError.notFound('Позиция не найден');
    }
    const item = await OrderItemModel.findOne({
      where: { /* orderId, */ id },
      include: [{ model: OrderModel, as: 'order', where: { id: orderId } }],
    });
    if (!item) {
      throw ApiError.notFound('Позиция Заказа не найдено');
    }
    await item.destroy();
    return item;
  }
}

export default new OrderItemService();
