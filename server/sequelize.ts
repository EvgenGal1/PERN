// ^ настройки подключения к серверу БД (sequelize | db)
import Sequelize from "sequelize";

export default new Sequelize(
  process.env.DB_NAME_PERN /* Tok */, // база данных
  process.env.DB_USER, // пользователь
  process.env.DB_PASS_PERN, // пароль
  {
    dialect: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    define: {
      // использовать snake_case вместо camelCase для полей таблиц БД. вкл.поля
      underscored: true,
      // не добавлять поля created_at и updated_at при создании таблиц
      // timestamps: false,
      timestamps: true,
      // вкл. `createdAt`
      createdAt: true,
      // вкл. `updatedAt`
      updatedAt: true,
      // Изменяем название `updatedAt`
      // updatedAt: 'updateTimestamp',
    },
    // ^ Формат даты заказа. 1ый способ. ? Нужно для 2го ?
    logging: false, // ! не ?перезаписывает? Таблицы (нет лога созд.Табл.)
    timezone: "Europe/Moscow",
  }
);
