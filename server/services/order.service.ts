// ^ сервис для работы с заказами
import AppError from '../error/ApiError';
import { Order as OrderModel } from '../models/model';
import { OrderItem as OrderItemModel } from '../models/model';

// Типы данных
interface Orders {
  name: string | number;
  email: string;
  phone: string | number;
  address: string;
  comment: string | number | null | undefined;
  amount: number;
  userId: number;
  items?: OrderItem[];
  // createdAt: Date;
  // updatedAt: Date;
}

interface CreateData {
  name: string | number;
  email: string;
  phone: string | number;
  address: string;
  comment: string | number | null | undefined;
  amount: number;
  userId: number;
  items?: string;
  // items?: OrderItem[]|string;
}

interface UpdateData {
  name: string | number;
  email: string;
  phone: string | number;
  address: string;
  comment: string | number | null | undefined;
  amount: number;
  userId: number;
  // items?: string;
  items?: OrderItem[];
  // items?: OrderItem[]|string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  // createdAt: Date;
  // updatedAt: Date;
}

class OrderService {
  async getAllOrder(userId = null) {
    try {
      const options: any = {};
      if (userId) {
        options.where = { userId };
      }
      const orders = await OrderModel.findAll(options);
      return orders;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Заказы не получены`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async getOneOrder(id: any, userId: any = null) {
    try {
      const options: any = {
        where: { id },
        include: [
          {
            model: OrderItemModel,
            as: 'items',
            attributes: ['id', 'name', 'price', 'quantity'],
          },
        ],
      };
      if (userId) options.where.userId = userId;
      const order = await OrderModel.findOne(options);
      // ^ подобие prod.serv
      // const order = await OrderModel.findByPk(id, {
      //   include: [{ model: OrderItemModel, as: "items" }],
      // });
      //
      if (!order) {
        throw new Error('Заказ не найден в БД');
      }
      return order;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Заказ не получен`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async createOrder(data: any /* CreateData */) /* : Promise<Orders> */ {
    try {
      // общая стоимость заказа
      const items = data.items;
      const amount: any = items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0,
      );

      // данные для создания заказа
      const {
        name,
        email,
        phone,
        address,
        comment = null,
        userId = null,
      } = data;

      const order = await OrderModel.create({
        name,
        email,
        phone,
        address,
        comment,
        amount,
        userId,
      });

      // товары, входящие в заказ
      for (let item of items) {
        await OrderItemModel.create({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          orderId: order.id,
        });
      }

      // возвращать будем заказ с составом
      const created = await OrderModel.findByPk(order.id, {
        include: [
          {
            model: OrderItemModel,
            as: 'items',
            attributes: ['name', 'price', 'quantity'],
          },
        ],
      });

      return created;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Заказ не создан`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async updateOrder(id: string | number, data: /* any */ UpdateData) {
    try {
      // const order = await OrderModel.findByPk(id);
      const order = await OrderModel.findByPk(id, {
        include: [{ model: OrderItemModel, as: 'items' }],
      });
      if (!order) {
        throw new Error('Заказ не найден в БД');
      }

      // общая стоимость заказа
      // const items = data.items;
      const items = order.items;
      const amount: any = items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0,
      );

      // статус
      let status: number = order.status;
      if (
        data.name !== order.name ||
        data.email !== order.email ||
        data.phone !== order.phone ||
        data.address !== order.address ||
        data.comment !== order.comment
      ) {
        if (status === 2002 || status === 2003) {
          status = 2003;
        } else {
          status = 2001;
        }
      }

      // данные для создания заказа
      // const { name, email, phone, address, comment = null, userId = null } = data;
      const {
        name = order.name,
        email = order.email,
        phone = order.phone,
        address = order.address,
        comment = order.comment,
        userId = order.userId,
      } = data;
      await order.update({
        name,
        email,
        phone,
        address,
        comment,
        amount,
        userId,
        status,
      });
      //
      if (data.items) {
        // свойства товара
        // удаляем старые и добавляем новые
        await OrderItemModel.destroy({ where: { orderId: id } });
        // const items: any = JSON.parse(data.items);
        // товары, входящие в заказ
        for (let item of items) {
          await OrderItemModel.create({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            orderId: order.id,
          });
        }
      }

      // возвращать будем заказ с составом
      // const ordered = await OrderModel.findByPk(order.id, {
      //   include: [
      //     {
      //       model: OrderItemModel,
      //       as: "items",
      //       attributes: ["name", "price", "quantity"],
      //     },
      //   ],
      // });

      // return ordered;

      // обновим объект товара, чтобы вернуть свежие данные
      await order.reload();

      return order;
      // return pretty(order);
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Заказ не обновлён`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async deleteOrder(id) {
    try {
      let order = await OrderModel.findByPk(id, {
        include: [
          {
            model: OrderItemModel,
            as: 'items' /* , attributes: ["name", "price", "quantity"], */,
          },
        ],
      });
      if (!order) {
        throw new Error('Заказ не найден в БД');
      }
      await order.destroy();
      return order;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Заказ не удалён`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
}

export default new OrderService();
