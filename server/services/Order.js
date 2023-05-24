import { Order as OrderMapping } from "../models/mapping.js";
import { OrderItem as OrderItemMapping } from "../models/mapping.js";
import AppError from "../error/AppError_Tok.js";

class Order {
  async getAll(userId = null) {
    let orders;
    if (userId) {
      orders = await OrderMapping.findAll({ where: { userId } });
    } else {
      orders = await OrderMapping.findAll();
    }
    return orders;
  }

  async getOne(id, userId = null) {
    let order;
    if (userId) {
      order = await OrderMapping.findOne({
        where: { id, userId },
        include: [
          {
            model: OrderItemMapping,
            as: "items",
            attributes: ["name", "price", "quantity"],
          },
        ],
      });
    } else {
      order = await OrderMapping.findByPk(id, {
        include: [
          {
            model: OrderItemMapping,
            as: "items",
            attributes: ["name", "price", "quantity"],
          },
        ],
      });
    }
    if (!order) {
      throw new Error("Заказ не найден в БД");
    }
    return order;
  }

  async create(data) {
    // общая стоимость заказа
    const items = data.items;
    const amount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    // данные для создания заказа
    const { name, email, phone, address, comment = null, userId = null } = data;
    const order = await OrderMapping.create({
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
      await OrderItemMapping.create({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        orderId: order.id,
      });
    }
    // возвращать будем заказ с составом
    const created = await OrderMapping.findByPk(order.id, {
      include: [
        {
          model: OrderItemMapping,
          as: "items",
          attributes: ["name", "price", "quantity"],
        },
      ],
    });
    return created;
  }

  async delete(id) {
    let order = await OrderMapping.findByPk(id, {
      include: [
        { model: OrderItemMapping, attributes: ["name", "price", "quantity"] },
      ],
    });
    if (!order) {
      throw new Error("Заказ не найден в БД");
    }
    await order.destroy();
    return order;
  }
}

export default new Order();
