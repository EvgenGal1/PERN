import { Transaction } from 'sequelize';

import sequelize from '../config/sequelize';
import OrderModel from '../models/OrderModel';
import OrderItemModel from '../models/OrderItemModel';
import OrderItemService from './orderItems.service';
import {
  OrderCreateDto,
  OrderData,
  OrderUpdateData,
  OrderStatus,
} from '../types/order_item.interface';
import ApiError from '../middleware/errors/ApiError';
import DatabaseUtils from '../utils/database.utils';

class OrderService {
  private static readonly baseOrderAttributes = [
    'id',
    'username',
    'email',
    'phone',
    'address',
    'amount',
    'status',
    'comment',
    'createdAt',
  ];

  async getOneOrder(
    orderId: number,
    userId?: number,
    transaction?: Transaction,
  ): Promise<OrderModel> {
    const where: any = { id: orderId };
    if (userId) where.userId = userId;
    const order = await OrderModel.findOne({
      where,
      include: [
        {
          model: OrderItemModel,
          as: 'items',
          attributes: ['id', 'name', 'price', 'quantity'],
        },
      ],
      transaction,
    });
    if (!order) throw ApiError.notFound(`Заказ с ID '${orderId}' не найден`);
    return order;
  }

  // Все Заказы Пользователя
  async getAllOrdersUser(userId: number) {
    if (!userId) throw ApiError.badRequest('Не указан ID Пользователя');
    if (isNaN(userId))
      throw ApiError.badRequest('Некорректный ID Пользователя');
    const orders = await OrderModel.findAndCountAll({
      attributes: OrderService.baseOrderAttributes,
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    if (!orders.count) throw ApiError.notFound('Заказы не найдены');
    return orders;
  }

  // Все Заказы Всех Пользователей > ADMIN
  async getAllOrdersAdmin(): Promise<{ count: number; rows: OrderData[] }> {
    const orders = await OrderModel.findAndCountAll({
      attributes: OrderService.baseOrderAttributes,
      order: [['createdAt', 'DESC']],
    });

    if (!orders.count) throw ApiError.notFound('Заказы не найдены');
    return orders;
  }

  /**
   * созд.нов. Заказ с Позициями
   * @param data - данн. > созд. Заказа
   * @returns Promise<OrderData> - Заказ с Позициями
   */
  async createOrder(data: OrderCreateDto): Promise<OrderData> {
    // валид.данн.
    if (!Array.isArray(data.items)) {
      throw ApiError.badRequest('Неверный формат списка товаров');
    }
    if (data.items.length === 0) {
      throw ApiError.badRequest('Список товаров не может быть пустым');
    }

    // нач.транзакции
    const transaction = await sequelize.transaction();

    try {
      const { items, ...orderData } = data;
      // вычисл.общ.`сумма` Заказа по `цене` и `кол-ву` Позиций
      const amount = items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0,
      );
      // получ. наименьший ID Заказов
      const smallestOrderId = await DatabaseUtils.getSmallestIDAvailable(
        'order',
        transaction,
      );
      // созд.нов.Заказ со статусом по умолчанию
      const order = await OrderModel.create(
        {
          id: smallestOrderId,
          ...orderData,
          amount,
          status: OrderStatus.NEW,
        },
        { transaction },
      );

      // созд. Позиции Заказа
      await OrderItemService.createOrderItemsBatch(
        order.id,
        items,
        transaction,
      );

      // подтвердить транзакцию
      await transaction.commit();
      // возврат Заказ с Позициями после commit
      return this.getOneOrder(order.id);
    } catch (error) {
      // откат транзакции при ошб.
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * обнов. Заказ
   * @param orderId - ID Заказа
   * @param data - объ. Позиций для изменения
   * @param userId - ID Пользователя (опционально)
   */
  async updateOrder(
    id: number,
    data: OrderUpdateData,
    userId?: number,
  ): Promise<OrderData> {
    let order = await this.getOneOrder(id, userId);
    const { items, ...updateData } = data;

    // нов.общ.сумма на Позиции Заказа
    const amount =
      items?.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0,
      ) || order.amount;

    // нов.статус Заказа (продвиж.до 2010, конечный 9999 и обратка)
    let status: number = order?.status;
    if (!order.updatedAt || OrderStatus.NEW) status = OrderStatus.IN_PROGRESS;
    else if (
      order.status >= OrderStatus.IN_PROGRESS &&
      order.status < OrderStatus.COMPLETED
    ) {
      status += 1;
    } else if (order.status === OrderStatus.COMPLETED) {
      status = OrderStatus.CANCELLED;
    } else if (
      order.status > OrderStatus.COMPLETED &&
      order.status <= OrderStatus.CANCELLED
    ) {
      status -= 1;
    }

    // обнов. Заказа
    await order.update({ ...updateData, amount, status });

    // обнов. Позиций Заказа
    if (items) {
      // удал.старые Позиции Продуктов в Заказе
      await OrderItemModel.destroy({ where: { orderId: id } });
      // созд.заново Позиции Продуктов входящие в Заказ
      await OrderItemService.createOrderItemsBatch(
        id,
        items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      );
    }
    // await order.reload(); // обнов.объ.Заказа чтоб вернуть свежие данные
    // возврат нов.Заказа
    return (await this.getOneOrder(id)).get({ plain: true }) as OrderData;
  }

  async deleteOrder(id: number, userId?: number): Promise<void> {
    const order = await this.getOneOrder(id, userId);
    await order.destroy();
  }
}

export default new OrderService();
