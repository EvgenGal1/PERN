import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

import { Models } from '../types/models.interfaсe';

class OrderItemModel extends Model<
  InferAttributes<OrderItemModel>,
  InferCreationAttributes<OrderItemModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare price: number;
  declare quantity: number;
  declare orderId: number;

  static associate(models: Models) {
    OrderItemModel.belongsTo(models.OrderModel, {
      as: 'order',
      foreignKey: 'orderId',
    });
  }

  static initModel(sequelize: Sequelize) {
    OrderItemModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.FLOAT, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        orderId: { type: DataTypes.INTEGER, allowNull: false },
      },
      { sequelize, tableName: 'order_items' },
    );
  }
}

export default OrderItemModel;
