import OrderModel from '../models/OrderModel';
import OrderItemModel from '../models/OrderItemModel';
import {
  OrderCreateDto,
  OrderData,
  OrderUpdateData,
  OrderStatus,
} from '../types/order_item.interface';
import ApiError from '../middleware/errors/ApiError';

class OrderService {
  async getOneOrder(id: number, userId?: number): Promise<OrderModel> {
    const queryOptions = {
      where: { id },
      attributes: [
        'id',
        'name',
        'email',
        'phone',
        'address',
        'amount',
        'status',
        'comment',
      ],
      include: [
        {
          model: OrderItemModel,
          as: 'items',
          attributes: ['id', 'name', 'price', 'quantity'],
        },
      ],
    };
    if (userId) queryOptions.where['id'] = userId;
    const order = await OrderModel.findOne(queryOptions);
    if (!order) throw ApiError.notFound(`Заказ с ID '${id}' не найден`);
    return order;
  }

  async getAllOrders(
    userId?: number,
  ): Promise<{ count: number; rows: OrderData[] }> {
    const queryOptions: any = {
      attributes: [
        'id',
        'name',
        'email',
        'phone',
        'address',
        'amount',
        'status',
        'comment',
      ],
    };
    if (userId) queryOptions.where = { userId };
    const orders = await OrderModel.findAndCountAll(queryOptions);
    if (!orders.rows.length) throw ApiError.notFound('Заказы не найдены');
    return orders;
  }

  async createOrder(data: OrderCreateDto): Promise<OrderData> {
    const { items, ...orderData } = data;

    // общ.`сумма` Заказа по `цене` и `кол-ву` Позиций
    const amount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0,
    );

    // созд.нов.Заказ со статусом по умолчанию
    const order = await OrderModel.create({
      ...orderData,
      amount,
      status: OrderStatus.NEW,
    });

    // стар.подход
    // for (let item of data.items) { await OrderItemModel.create({ name: item.name, price: item.price, quantity: item.quantity, orderId: order.getDataValue('id'), }); }
    // возврат заказ с составом
    // const created = await OrderModel.findByPk(order.getDataValue('id'), { include: [ { model: OrderItemModel, as: 'items', attributes: ['name', 'price', 'quantity'], }, ] });
    // if (!created) throw ApiError.badRequest('Созданный заказ не найден');
    // return created.get({ plain: true }) as OrderModel;
    if (!Array.isArray(items) || items.length === 0) {
      throw ApiError.badRequest('Список продуктов не может быть пустым');
    }
    // параллельно созд.Позиции входящие в Заказ
    await Promise.all(
      items.map((item) =>
        OrderItemModel.create({
          orderId: order.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }),
      ),
    );

    // возврат Заказ с Позициями
    return this.getOneOrder(order.id);
  }

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
    let status: number = order.status;
    if (!order.updatedAt || OrderStatus.NEW) status = OrderStatus.IN_PROGRESS;
    else if (
      order.status >= OrderStatus.IN_PROGRESS &&
      order.status < OrderStatus.COMPLETED
    ) {
      status = order.status + 1;
    } else if (order.status === OrderStatus.COMPLETED) {
      status = OrderStatus.CANCELLED;
    } else if (
      order.status > OrderStatus.COMPLETED &&
      order.status <= OrderStatus.CANCELLED
    ) {
      status = order.status - 1;
    }

    // обнов.данн.Заказа
    await order.update({ ...updateData, amount, status });

    // обнов.Позиции Заказа
    if (items) {
      // удал.старые Позиции Продуктов в Заказе
      await OrderItemModel.destroy({ where: { orderId: id } });
      // Позиции Продуктов входящие в Заказ
      await Promise.all(
        items.map((item) => {
          OrderItemModel.create({
            orderId: id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          });
        }),
      );
    }
    // await order.reload(); // обнов.объ.Заказа чтоб вернуть свежие данные
    // возврат нов.Заказа
    return this.getOneOrder(id);
  }

  async deleteOrder(id: number, userId?: number): Promise<void> {
    const order = await this.getOneOrder(id, userId);
    await order.destroy();
  }
}

export default new OrderService();
