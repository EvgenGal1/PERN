import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  Optional,
  CreationOptional,
} from 'sequelize';

class OrderModel extends Model<
  InferAttributes<OrderModel>,
  InferCreationAttributes<OrderModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare address: string;
  declare amount: number;
  declare status: number;
  declare comment: string | null;
  declare prettyCreatedAt?: string;
  declare prettyUpdatedAt?: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static associate(models: any) {
    OrderModel.hasMany(models.OrderItemModel, {
      as: 'items',
      foreignKey: 'orderId',
      onDelete: 'CASCADE',
    });
    OrderModel.belongsTo(models.UserModel, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'SET NULL',
    });
  }

  static initModel(sequelize: Sequelize) {
    OrderModel.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.FLOAT, allowNull: false },
        status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        comment: { type: DataTypes.STRING },
        prettyCreatedAt: {
          type: DataTypes.VIRTUAL,
          get(this: OrderModel) {
            const createdAt = this.getDataValue('createdAt');
            if (createdAt) {
              const date = new Date(createdAt);
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear();
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              return `${day}.${month}.${year} ${hours}:${minutes}`;
            }
            return '';
          },
        },
        prettyUpdatedAt: {
          type: DataTypes.VIRTUAL,
          get(this: OrderModel) {
            const updatedAt = this.getDataValue('updatedAt');
            if (updatedAt) {
              const date = new Date(updatedAt);
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear();
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              return `${day}.${month}.${year} ${hours}:${minutes}`;
            }
            return '';
          },
        },
      },
      { sequelize, tableName: 'orders' },
    );
  }
}

export default OrderModel;
