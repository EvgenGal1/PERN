import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

import { Models } from '../types/models.interfaсe';

class RoleModel extends Model<
  InferAttributes<RoleModel>,
  InferCreationAttributes<RoleModel>
> {
  declare id: CreationOptional<number>;
  declare value: string;
  declare description: string;

  static associate(models: Models) {
    RoleModel.belongsToMany(models.UserModel, {
      through: models.UserRoleModel,
      foreignKey: 'roleId', // указ.внешн.ключ
      as: 'users',
      otherKey: 'userId', // указ.доп.внешн.ключ
      onDelete: 'CASCADE',
    });
    // доп.связи > раб.с промеж.табл.
    RoleModel.hasMany(models.UserRoleModel, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE',
    });
    models.UserRoleModel.belongsTo(RoleModel, { foreignKey: 'roleId' });
  }

  static initModel(sequelize: Sequelize) {
    RoleModel.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        value: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.STRING },
      },
      { sequelize, tableName: 'roles' },
    );
  }
}

export default RoleModel;
