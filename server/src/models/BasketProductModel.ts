import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
} from 'sequelize';

import { Models } from '../types/models.interfaсe';

class BasketProductModel extends Model<
  InferAttributes<BasketProductModel>,
  InferCreationAttributes<BasketProductModel>
> {
  declare basketId: number;
  declare productId: number;
  declare quantity: number;

  static associate(models: Models) {
    BasketProductModel.belongsTo(models.BasketModel, {
      foreignKey: 'basketId',
      onDelete: 'CASCADE',
    });
    BasketProductModel.belongsTo(models.ProductModel, {
      foreignKey: 'productId',
      onDelete: 'CASCADE',
    });
  }

  static initModel(sequelize: Sequelize) {
    BasketProductModel.init(
      {
        basketId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
      },
      { sequelize, tableName: 'basket_products' },
    );
  }
}

export default BasketProductModel;
