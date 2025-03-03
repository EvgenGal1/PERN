import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

import { Models } from '../types/models.interfaсe';

class TokenModel extends Model<
  InferAttributes<TokenModel>,
  InferCreationAttributes<TokenModel>
> {
  // св-ва модели с типами (CreationOptional - мжн.пусто, авто.созд.)
  declare id: CreationOptional<number>;
  declare userId: number;
  declare basketId: number;
  declare refreshToken: string;
  declare refreshTokenExpires: Date | null;
  declare resetToken: string | null;
  declare resetTokenExpires: Date | null;

  // мтд.устан.связей м/у моделями
  static associate(models: Models) {
    TokenModel.belongsTo(models.UserModel, { foreignKey: 'userId' });
    TokenModel.belongsTo(models.BasketModel, { foreignKey: 'basketId' });
  }

  // мтд.инициализации модели, опред.структуры
  static initModel(sequelize: Sequelize) {
    TokenModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
        basketId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        refreshToken: { type: DataTypes.STRING(350), allowNull: false },
        refreshTokenExpires: { type: DataTypes.DATE, allowNull: true },
        resetToken: { type: DataTypes.STRING(350), allowNull: true },
        resetTokenExpires: { type: DataTypes.DATE, allowNull: true },
      },
      { sequelize, tableName: 'tokens' },
    );
  }
}

export default TokenModel;
