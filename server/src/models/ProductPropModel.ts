import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

import ProductModel from './ProductModel';

class ProductPropModel extends Model<
  InferAttributes<ProductPropModel>,
  InferCreationAttributes<ProductPropModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare value: string;
  declare productId: number;

  static associate() {
    ProductPropModel.belongsTo(ProductModel, {
      as: 'product',
      foreignKey: 'productId',
    });
  }

  static initModel(sequelize: Sequelize) {
    ProductPropModel.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        value: { type: DataTypes.STRING, allowNull: false },
        productId: { type: DataTypes.INTEGER, allowNull: false },
      },
      { sequelize, tableName: 'product_props' },
    );
  }
}

export default ProductPropModel;
