import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
} from 'sequelize';

import { Models } from '../types/models.interfaсe';

class RatingModel extends Model<
  InferAttributes<RatingModel>,
  InferCreationAttributes<RatingModel>
> {
  declare rate: string | number;
  declare productId: number;
  declare userId: number;

  static associate(models: Models) {
    RatingModel.belongsTo(models.ProductModel, {
      foreignKey: 'productId',
      onDelete: 'CASCADE',
    });
    RatingModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  }

  static initModel(sequelize: Sequelize) {
    RatingModel.init(
      {
        rate: { type: DataTypes.FLOAT, allowNull: false },
        productId: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
      },
      { sequelize, tableName: 'ratings' },
    );
  }
}

export default RatingModel;
