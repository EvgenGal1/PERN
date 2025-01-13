import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

class BasketModel extends Model<
  InferAttributes<BasketModel>,
  InferCreationAttributes<BasketModel>
> {
  declare id: CreationOptional<number>;
  declare userId: number;

  static associate(models: any) {
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
