// ^ настройки подключения к серверу БД. Спец.для Tok (подобие db.js)
import Sequelize from "sequelize";

export default new Sequelize(
  process.env.DB_NAME_Tok, // база данных
  process.env.DB_USER, // пользователь
  process.env.DB_PASSWORD, // пароль
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    // убрать авто.поля createdAt и updatedAt
    define: {
      // ! ошб. при коммит. - Cannot read properties of undefined (reading 'length')
      // использовать snake_case вместо camelCase для полей таблиц БД
      underscored: true, // вкл.поля
      // ! ошб. при коммит. - Cannot read properties of undefined (reading 'map')
      timestamps: false, // не добавлять поля created_at и updated_at при создании таблиц
    },
    // ^ Формат даты заказа. 1ый способ. ? Нужно для 2го ?
    logging: false,
    timezone: "Europe/Moscow",
  }
);
