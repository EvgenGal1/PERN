// ^ сервис для работы с заказами
import { OrderAttributes, OrderItemAttributes } from 'models/sequelize-types';
import { Model } from 'sequelize';
import AppError from '../middleware/errors/ApiError';
import { OrderModel } from '../models/model';
import { OrderItemModel } from '../models/model';

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
  orderId: number;
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
      return order as unknown as OrderAttributes;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Заказ не получен`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async createOrder(data: any /* CreateData */): Promise<OrderAttributes> {
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
        // id,
        name,
        email,
        phone,
        address,
        comment,
        amount,
        status: 2001, // or any default status value
        // userId,
      });

      // товары, входящие в заказ
      for (let item of items) {
        await OrderItemModel.create({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          orderId: order.getDataValue('id'),
        });
      }

      // возвращать будем заказ с составом
      // const created = await OrderModel.findByPk(order.id, {
      const created = await OrderModel.findByPk(order.getDataValue('id'), {
        include: [
          {
            model: OrderItemModel,
            as: 'items',
            attributes: ['name', 'price', 'quantity'],
          },
        ],
      });

      if (!created) {
        throw new Error('Созданный заказ не найден');
      }
      return created as unknown as OrderAttributes;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Заказ не создан`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async updateOrder(
    id: string | number,
    data: any /* UpdateData */,
  ): Promise<OrderAttributes> {
    try {
      // const order = await OrderModel.findByPk(id);
      const order = (await OrderModel.findByPk(id, {
        include: [{ model: OrderItemModel, as: 'items' }],
      })) /* as unknown as OrderAttributes */ as Model<OrderAttributes> & {
        items: OrderItemAttributes[];
      };
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
      // let status: number = order.status;
      let status: number = order.get('status') as unknown as number;
      if (
        data.name !== order.get('name') ||
        data.email !== order.get('email') ||
        data.phone !== order.get('phone') ||
        data.address !== order.get('address') ||
        data.comment !== order.get('comment')
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
        name = order.get('name'),
        email = order.get('email'),
        phone = order.get('phone'),
        address = order.get('address'),
        comment = order.get('comment'),
        // userId = order.userId,
      } = data;
      await order.update({
        name,
        email,
        phone,
        address,
        comment,
        amount,
        // userId,
        status,
      });
      //
      if (data.items) {
        // свойства товара
        // удаляем старые и добавляем новые
        // await OrderItemModel.destroy({ where: { orderId: id } });
        await OrderItemModel.destroy({
          where: { id: order.getDataValue('id') },
        });
        // const items: any = JSON.parse(data.items);
        // товары, входящие в заказ
        for (let item of items) {
          await OrderItemModel.create({
            id: order.getDataValue('id'),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
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

      // return order as unknown as OrderAttributes;
      return order.get() as OrderAttributes;
      // return pretty(order);
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Заказ не обновлён`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async deleteOrder(id: number) {
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
