// import sequelize from "../sequelize.js"; // ^ Формат даты заказа. 1ый способ
import AppError from "../error/ApiError";
import { Order as OrderMapping } from "../models/mapping";
import { OrderItem as OrderItemMapping } from "../models/mapping";

class Order {
  async getAll(userId = null) {
    // let orders;
    // if (userId) {
    //   orders = await OrderMapping.findAll({ where: { userId } });
    // } else {
    //   orders = await OrderMapping.findAll();
    // }
    // ^ Формат даты заказа. 1ый способ
    // const options = {
    //   attributes: {
    //     include: [
    //       [
    //         sequelize.fn(
    //           // "to_char",
    //           // sequelize.col("created_at"),
    //           // "DD.MM.YYYY HH24:MI"
    //           // ^ при раб.с MySQL замен.to_char > DATE_FORMAT
    //           "DATE_FORMAT",
    //           sequelize.col("created_at"),
    //           "%d-%m-%Y %H:%i"
    //         ),
    //         "prettyCreated",
    //       ],
    //     ],
    //   },
    // };
    // ^ Формат даты заказа. 2ый способ
    const options: any = {};
    if (userId) {
      options.where = { userId };
    }
    const orders = await OrderMapping.findAll(options);
    return orders;
  }

  async getOne(id: any, userId: any = null) {
    // ^ стар.код
    // let order;
    // if (userId) {
    //   order = await OrderMapping.findOne({
    //     where: { id, userId },
    //     include: [
    //       {
    //         model: OrderItemMapping,
    //         as: "items",
    //         attributes: ["name", "price", "quantity"],
    //       },
    //     ],
    //   });
    // } else {
    //   order = await OrderMapping.findByPk(id, {
    //     include: [
    //       {
    //         model: OrderItemMapping,
    //         as: "items",
    //         attributes: ["name", "price", "quantity"],
    //       },
    //     ],
    //   });
    // }
    // ^ нов.код из github
    const options: any = {
      where: { id },
      include: [
        {
          model: OrderItemMapping,
          as: "items",
          attributes: ["id", "name", "price", "quantity"],
        },
      ],
    };
    if (userId) options.where.userId = userId;
    const order = await OrderMapping.findOne(options);
    if (!order) {
      throw new Error("Заказ не найден в БД");
    }
    return order;
  }

  async create(data) {
    console.log("SRV ordServ data 1 : " + data);
    console.log(data);
    // общая стоимость заказа
    const items = data.items;
    console.log("SRV ordServ data.items : " + data.items);
    console.log(data.items);
    const amount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    // данные для создания заказа
    const { name, email, phone, address, comment = null, userId = null } = data;
    console.log("SRV ordServ data 2 : " + data);
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
      console.log("SRV ordServ FOR item : " + item);
      console.log(item);
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
    console.log("SRV ordServ created : " + created);
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
