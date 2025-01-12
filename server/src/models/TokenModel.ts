import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

import UserModel from './UserModel';
import BasketModel from './BasketModel';

class TokenModel extends Model<
  InferAttributes<TokenModel>,
  InferCreationAttributes<TokenModel>
> {
  // объяв.тип > атриб.модели (CreationOptional - мжн.пусто, авто.созд.)
  declare id: CreationOptional<number>;
  declare userId: number;
  declare basketId: number;
  declare refreshToken: string;

  // мтд.устан.связей м/у моделями
  static associate() {
    TokenModel.belongsTo(UserModel, { foreignKey: 'userId' });
    TokenModel.belongsTo(BasketModel, { foreignKey: 'basketId' });
  }

  // мтд.инициализации модели, опред.структуры
  static initModel(sequelize: Sequelize) {
    TokenModel.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
        basketId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        refreshToken: { type: DataTypes.STRING(300), allowNull: true },
      },
      { sequelize, tableName: 'tokens' },
    );
  }
}

export default TokenModel;
