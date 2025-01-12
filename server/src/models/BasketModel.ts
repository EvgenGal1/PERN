import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

import UserModel from './UserModel';
import ProductModel from './ProductModel';
import BasketProductModel from './BasketProductModel';

class BasketModel extends Model<
  InferAttributes<BasketModel>,
  InferCreationAttributes<BasketModel>
> {
  declare id: CreationOptional<number>;
  declare userId: number;

  static associate() {
    BasketModel.belongsTo(UserModel, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    BasketModel.belongsToMany(ProductModel, {
      through: BasketProductModel,
      as: 'products',
      foreignKey: 'basketId',
      otherKey: 'productId',
      onDelete: 'CASCADE',
    });
  }

  static initModel(sequelize: Sequelize) {
    BasketModel.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
      },
      { sequelize, tableName: 'baskets' },
    );
  }
}

export default BasketModel;
