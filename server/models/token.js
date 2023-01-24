// const { Schema, model } = require("mongoose");
// подкл.конфиг.БД
const { sequelize } = require("../db");
// подкл.кл.типы полей
const { DataTypes } = require("sequelize");

// ^ Токенов 2 вида. ACCESS(`доступ` к серверу, живёт 15мин-3сут, хран.LS) и REFRESH(`Обновлять` access, 14-60дн, хран.cookie(httpOnly)).

// const Token = new Schema({ // mondoose
const Token = sequelize.define("token", {
  // ссылка на id польз.
  user: { type: DataTypes.STRING /* ObjectId */ /* , ref: "user" */ },
  // `обновлять` токен созд.в БД
  refreshToken: { type: DataTypes.STRING, required: true },
  // ipАдрес входа, `Отпечаток пальца` браузера,..
});

// экспорт modal(резул.раб.fn) с назв.модели и схемой раб./созд.
// model.exports = model("Token", Token);
module.exports = { Token };
