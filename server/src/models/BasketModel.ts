import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { Models } from '../types/models.interfaсe';
import BasketProductModel from './BasketProductModel';

class BasketModel extends Model<
  InferAttributes<BasketModel>,
  InferCreationAttributes<BasketModel>
> {
  // св-ва модели с типами (CreationOptional - мжн.пусто, авто.созд.)
  declare id: CreationOptional<number>;
  declare userId: number;
  // св-во модели как связь/ассоц. масс.данн.
  declare products?: NonAttribute<BasketProductModel[]>;

  // мтд.устан.связей м/у моделями
  static associate(models: Models) {
    BasketModel.belongsTo(models.UserModel, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    BasketModel.belongsToMany(models.ProductModel, {
      through: models.BasketProductModel,
      as: 'products',
      foreignKey: 'basketId',
      otherKey: 'productId',
      onDelete: 'CASCADE',
    });
  }

  // мтд.инициализации модели, опред.структуры
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
