import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from 'sequelize';
import { Scopes } from 'sequelize-typescript';

import RoleModel from './RoleModel';
import TokenModel from './TokenModel';
import BasketModel from './BasketModel';
import RatingModel from './RatingModel';
import OrderModel from './OrderModel';
import UserRoleModel from './UserRoleModel';
import { Models } from '../types/models.interfaсe';

// настр. > отдел.вкл.в req
@Scopes(() => ({ withPassword: { attributes: { include: ['password'] } } }))
class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  // св-ва модели с типами (CreationOptional - мжн.пусто, авто.созд.)
  declare id: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare password: string;
  declare isActivated: CreationOptional<boolean>;
  declare activationLink: CreationOptional<string>;
  // declare createdAt?: Date;
  // declare updatedAt?: Date | null;

  // Ассоциации. Cвязанные моделей ток.чтен.со Мн.данн.
  public readonly roles?: RoleModel[];
  public readonly userRoles?: UserRoleModel[];
  public readonly tokens?: TokenModel[];
  public readonly basket?: BasketModel;
  public readonly orders?: OrderModel[];
  public readonly ratings?: RatingModel[];
  // > include без as с авто именем модели + s
  // public readonly UserRoleModels?: UserRoleModel[];

  // мтд.устан.связей м/у моделями
  static associate(models: Models) {
    UserModel.belongsToMany(models.RoleModel, {
      through: models.UserRoleModel,
      foreignKey: 'userId', // указ.внешн.ключ
      as: 'roles', // уник.имя ассоциаций
      otherKey: 'roleId', // указ.доп.внешн.ключ
      onDelete: 'CASCADE',
    });
    models.RoleModel.belongsToMany(UserModel, {
      through: models.UserRoleModel,
      foreignKey: 'roleId', // указ.внешн.ключ
      otherKey: 'userId', // указ.доп.внешн.ключ
      onDelete: 'CASCADE',
    });
    // доп.связи > раб.с промеж.табл. (возм.лишнее)
    UserModel.hasMany(models.UserRoleModel, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    models.UserRoleModel.belongsTo(UserModel, { foreignKey: 'userId' });
    // др.связи табл.с Пользователем
    UserModel.hasOne(models.BasketModel, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    UserModel.hasMany(models.TokenModel, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    UserModel.hasMany(models.OrderModel, {
      as: 'orders',
      foreignKey: 'userId',
      onDelete: 'SET NULL',
    });
    UserModel.belongsToMany(models.ProductModel, {
      through: models.RatingModel,
      foreignKey: 'userId', // указ.внешн.ключ
      otherKey: 'productId', // указ.доп.внешн.ключ
      as: 'ratings',
      onDelete: 'CASCADE',
    });
  }

  // мтд.устан.доп.хуков (дубль из init)
  // static hooks() {
  //   this.addHook('beforeCreate', (user: UserModel) => {
  //     if (!user.username) {
  //       user.username = `User__${user.email.split('@')[0]}-${user.email.split('.').pop()}`;
  //     }
  //   });
  // }

  // мтд.инициализации модели, опред.структуры
  static initModel(sequelize: Sequelize) {
    UserModel.init(
      // описание атрибутов
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
        activationLink: { type: DataTypes.STRING, defaultValue: 'нет ссылки' },
        // createdAt: { type: DataTypes.DATE, allowNull: false },
        // updatedAt: { type: DataTypes.DATE, allowNull: true },
      },
      // конфигурация модели
      {
        sequelize,
        tableName: 'users',
        // исключ.из всей выборки
        defaultScope: { attributes: { exclude: ['password'] } },
        // отдел.вкл.в выборку
        scopes: { withPassword: { attributes: { include: ['password'] } } },
        hooks: {
          // преднастр.пуст.имени
          beforeCreate: async (user) => {
            if (!user.username) {
              user.username = `User__${user.email.split('@')[0]}-${user.email.slice(user.email.lastIndexOf('.') + 1)}`;
            }
          },
        },
      },
    );
  }
}

export default UserModel;
