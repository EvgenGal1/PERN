// от ошб.повтор.объяв.перем в блоке
export {};

// const { Schema, model } = require("mongoose");
// подкл.конфиг.БД
const { sequelize } = require("../db");
// подкл.кл.типы полей
const { DataTypes } = require("sequelize");

// Схему роли в БД
// const Role = new Schema({
const Role = sequelize.define("role", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // по умолч. роль USER и уникальна
  // value: { type: String, unique: true, default: "USER" },
  value: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    defaultValue: "USER",
  },
});

// экспорт modal(резул.раб.fn) с назв.модели и схемой раб./созд.
// model.exports = model("Role", Role);
module.exports = Role;
