import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

import UserModel from './UserModel';
import RoleModel from './RoleModel';

class UserRoleModel extends Model<
  InferAttributes<UserRoleModel>,
  InferCreationAttributes<UserRoleModel>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare roleId: number;
  declare level: number;

  static associate() {
    UserRoleModel.belongsTo(UserModel, { foreignKey: 'userId' });
    UserRoleModel.belongsTo(RoleModel, { foreignKey: 'roleId' });
  }

  static initModel(sequelize: Sequelize) {
    UserRoleModel.init(
      {
        id: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
        roleId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
        level: { type: DataTypes.INTEGER, defaultValue: 1 },
      },
      { sequelize, tableName: 'user_roles' },
    );
  }
}

export default UserRoleModel;
