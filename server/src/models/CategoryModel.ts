import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

import ProductModel from './ProductModel';

class CategoryModel extends Model<
  InferAttributes<CategoryModel>,
  InferCreationAttributes<CategoryModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;

  static associate() {
    CategoryModel.hasMany(ProductModel, {
      foreignKey: 'categoryId',
      as: 'products',
      onDelete: 'RESTRICT',
    });
  }

  static initModel(sequelize: Sequelize) {
    CategoryModel.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
      },
      { sequelize, tableName: 'categories' },
    );
  }
}

export default CategoryModel;
