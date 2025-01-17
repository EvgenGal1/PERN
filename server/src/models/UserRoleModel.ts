import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

import { Models } from '../types/models.interfaсe';

class UserRoleModel extends Model<
  InferAttributes<UserRoleModel>,
  InferCreationAttributes<UserRoleModel>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare roleId: number;
  declare level: number;

  static associate(models: Models) {
    UserRoleModel.belongsTo(models.UserModel, { foreignKey: 'userId' });
    UserRoleModel.belongsTo(models.RoleModel, { foreignKey: 'roleId' });
  }

  static initModel(sequelize: Sequelize) {
    UserRoleModel.init(
      {
        id: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
        roleId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
        level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      },
      { sequelize, tableName: 'user_roles' },
    );
  }
}

export default UserRoleModel;
