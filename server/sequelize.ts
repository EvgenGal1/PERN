// ^ настройки подключения к серверу БД (sequelize | db)
import Sequelize from 'sequelize';

export default new Sequelize(
  process.env.DB_NAME, // база данных
  process.env.DB_USER, // пользователь
  process.env.DB_PSW, // пароль
  {
    dialect: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    define: {
      // вкл. snake_case вместо camelCase > назв.полей БД
      underscored: true,
      // вкл.поля created_at и updated_at
      timestamps: true,
      // вкл. `createdAt`
      createdAt: true,
      // вкл. `updatedAt`
      updatedAt: true,
      // измен.назв.`updatedAt`
      // updatedAt: 'updateTimestamp',
    },
    logging: false, // без лог.записей
    timezone: 'Europe/Moscow',
  },
);
