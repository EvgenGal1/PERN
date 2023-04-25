// ^ настройки подключения к серверу БД. Спец.для Tok (подобие db.js)
import Sequelize from "sequelize";

export default new Sequelize(
  process.env.DB_NAME_Tok, // база данных
  process.env.DB_USER, // пользователь
  process.env.DB_PASS, // пароль
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    // убрать авто.поля createdAt и updatedAt
    define: {
      underscored: true, // использовать snake_case вместо camelCase для полей таблиц БД
      timestamps: false, // не добавлять поля created_at и updated_at при создании таблиц
    },
  }
);
