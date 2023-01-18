// модели данных табл.

// подкл.конфиг.БД
const { sequelize } = require("../db");
// подкл.кл.типы полей
const { DataTypes } = require("sequelize");

// ОПИСАНИЕ МОДЕЛЕЙ
// Юзер, определить(назв.,поля{})
const User = sequelize.define("user", {
  // id тип.целое число,перв.ключ,авто.добавка
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // добавил name, удалить можно через pgAdmin, залить сначала удалив табл.с привязками DROP TABLE IF EXISTS users CASCADE;
  /* fullName */ /* required: true, */
  name: { type: DataTypes.STRING, unique: true },
  // email тип.стр.,уникальное
  email: { type: DataTypes.STRING, unique: true },
  // password тип.стр.
  password: { type: DataTypes.STRING },
  // роль тип.стр.,знач.по умолч.USER
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

// Корзина
const Backet = sequelize.define("backet", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Резервное устройство
const BacketDevice = sequelize.define("backet_device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Устройство
const Device = sequelize.define("device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // назв. тип стр.,уник.,не пуст.знач.
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  // рейтинг изнач.0
  rating: { type: DataTypes.INTEGER, defaultValue: 0 },
  img: { type: DataTypes.STRING, allowNull: false },
});

// Тип
const Type = sequelize.define("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// Бренд
const Brand = sequelize.define("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// Рейтинг
const Rating = sequelize.define("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
});

// Информация об устройстве
const DeviceInfo = sequelize.define("device_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

// СВЯЗЬ МОДЕЛЕЙ ДРсДР. ИМЕЕТ(одну,много) | ПРИНАДЛЕЖИТ(одному,многим).
// У модели вызов fn(hasOne,hasMany|belongsTo,belongsToMany)

// связующая табл.|модель для Type|Brand. Внешн.ключи добавит sequelize
const TypeBrand = sequelize.define("type_brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// польз.и корзина связь один к одному(одна корзина) | корзина принадлеж.польз.
User.hasOne(Backet);
Backet.belongsTo(User);

// польз.и рейтинг много (наск.рейт.)
User.hasMany(Rating);
Rating.belongsTo(User);

Backet.hasMany(BacketDevice);
BacketDevice.belongsTo(Backet);

Type.hasMany(Device);
Device.belongsTo(User);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(Rating);
Rating.belongsTo(Device);

Device.hasMany(BacketDevice);
BacketDevice.belongsTo(Device);

// + назв.поля у масс.харак-ик
Device.hasMany(DeviceInfo, { as: "info" });
DeviceInfo.belongsTo(Device);

// связь м/у Типом и Брендом много ко многим `через` созд.промежут.табл.с инфо о принадл.кто к кому
Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

//экспорт моделей
module.exports = {
  User,
  Backet,
  BacketDevice,
  Device,
  DeviceInfo,
  Type,
  Brand,
  Rating,
  TypeBrand,
};