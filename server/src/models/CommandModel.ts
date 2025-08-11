import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
} from 'sequelize';

import { Models } from '../types/models.interfaсe';

class CommandModel extends Model<
  InferAttributes<CommandModel>,
  InferCreationAttributes<CommandModel>
> {
  declare id: number;
  declare name: string;
  declare description: string | null;
  // структура: { keys: string[], type: 'sequence' | 'simultaneous' | 'touchpad' }
  declare keyCombination: object;
  // Роли/Уровень доступа
  declare requiredRole: string;
  declare requiredLevel: number;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate(models: Models) {}

  static initModel(sequelize: Sequelize) {
    CommandModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        keyCombination: {
          type: DataTypes.JSONB,
          allowNull: false,
          // валидации в БД
          validate: {
            isValidJSON(value: any) {
              if (typeof value !== 'object' || !value.keys || !value.type) {
                throw new Error('keyCombination нужен как объ.с ключами/типом');
              }
            },
          },
        },
        requiredRole: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'required_role',
        },
        requiredLevel: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          field: 'required_level',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        // переопред.поля timestamps от настр. авто NotNull в sequelize.timestamps
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true, // разреш.null
          defaultValue: null,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'commands', // имя таблицы в БД
        // modelName: 'Command', // имя модели в коде (опционально)
        timestamps: false, // откл.вр.метки т.к. устан.вручную
      },
    );
  }
}

export default CommandModel;
