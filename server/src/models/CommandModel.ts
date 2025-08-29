import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
} from 'sequelize';

import { Models } from '../types/models.interfaсe';
import { KeyCombination } from '../types/command.interface';

class CommandModel extends Model<
  InferAttributes<CommandModel>,
  InferCreationAttributes<CommandModel>
> {
  declare id: number;
  declare name: string;
  declare description: string | null;
  // структура: { keys: string[], type: 'sequence' | 'simultaneous' | 'touchpad' }
  declare keyCombination: KeyCombination;
  // Роли/Уровень доступа
  declare requiredRole: string; // | null > общ.доступ.кмд.
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
              if (
                typeof value !== 'object' ||
                !Array.isArray(value.keys) ||
                !value.type ||
                !['sequence', 'simultaneous', 'touchpad'].includes(value.type)
              ) {
                throw new Error(
                  'keyCombination должен быть объ.с клавишими/типом',
                );
              }
              if (!value.keys.every((k: any) => typeof k === 'string')) {
                throw new Error('keyCombination.keys должны быть строками');
              }
            },
          },
        },
        requiredRole: {
          type: DataTypes.STRING,
          allowNull: false, // true для общ.доступ.кмд.
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
        timestamps: false, // откл.вр.метки т.к. устан.вручную
        // modelName: 'Command', // имя модели в коде (опционально)
      },
    );
  }
}

export default CommandModel;
