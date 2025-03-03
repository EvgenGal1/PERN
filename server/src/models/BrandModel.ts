import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

import { Models } from '../types/models.interfaсe';

class BrandModel extends Model<
  InferAttributes<BrandModel>,
  InferCreationAttributes<BrandModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;

  static associate(models: Models) {
    BrandModel.hasMany(models.ProductModel, {
      foreignKey: 'brandId',
      as: 'products',
      onDelete: 'RESTRICT',
    });
  }

  static initModel(sequelize: Sequelize) {
    BrandModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
      },
      { sequelize, tableName: 'brands' },
    );
  }
}

export default BrandModel;
