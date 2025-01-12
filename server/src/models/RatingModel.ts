import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
} from 'sequelize';

import UserModel from './UserModel';
import ProductModel from './ProductModel';

class RatingModel extends Model<
  InferAttributes<RatingModel>,
  InferCreationAttributes<RatingModel>
> {
  declare rate: string | number;
  declare productId: number;
  declare userId: number;

  static associate() {
    RatingModel.belongsTo(ProductModel, {
      foreignKey: 'productId',
      onDelete: 'CASCADE',
    });
    RatingModel.belongsTo(UserModel, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  }

  static initModel(sequelize: Sequelize) {
    RatingModel.init(
      {
        rate: { type: DataTypes.STRING, allowNull: false },
        productId: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
      },
      { sequelize, tableName: 'ratings' },
    );
  }
}

export default RatingModel;
