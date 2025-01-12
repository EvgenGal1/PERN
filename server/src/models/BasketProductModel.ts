import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
} from 'sequelize';

import BasketModel from './BasketModel';
import ProductModel from './ProductModel';

class BasketProductModel extends Model<
  InferAttributes<BasketProductModel>,
  InferCreationAttributes<BasketProductModel>
> {
  declare basketId: number;
  declare productId: number;
  declare quantity: number;

  static associate() {
    BasketProductModel.belongsTo(BasketModel, { foreignKey: 'basketId' });
    BasketProductModel.belongsTo(ProductModel, { foreignKey: 'productId' });
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
