import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

import ProductModel from './ProductModel';

class BrandModel extends Model<
  InferAttributes<BrandModel>,
  InferCreationAttributes<BrandModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;

  static associate() {
    BrandModel.hasMany(ProductModel, {
      foreignKey: 'brandId',
      as: 'products',
      onDelete: 'RESTRICT',
    });
  }

  static initModel(sequelize: Sequelize) {
    BrandModel.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
      },
      { sequelize, tableName: 'brands' },
    );
  }
}

export default BrandModel;
