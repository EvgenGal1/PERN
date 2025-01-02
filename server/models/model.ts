// ^ ORM (Object-relational mapping `Объектно-реляционное отображение`).
// ^ СЛН. модели данных табл. (подобие modelsTS/JS)
import sequelize from '../sequelize';
import database from 'sequelize';
const { DataTypes } = database;

/*
 * Описание моделей
 */

const User = sequelize.define(
  'user',
  {
    // тип целое число, перв.ключ, авто.добавка
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // добавил name, удалить можно через pgAdmin, залить сначала удалив табл.с привязками DROP TABLE IF EXISTS users CASCADE;
    username: { type: DataTypes.STRING, unique: true, required: true },
    // тип строка, уникальное, обязательно
    email: { type: DataTypes.STRING, unique: true, required: true },
    password: { type: DataTypes.STRING, required: true },
    // ^^ перенос в Role
    // role: {
    //   type: DataTypes.STRING,
    //   defaultValue: "USER" /* , required: true */,
    // },
    // `активируется` - подтвержд.почты от польз.
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    // `Ссылка активации` - хран.ссылку для актив.
    activationLink: { type: DataTypes.STRING, defaultValue: 'нет ссылки' },
  },
  // знач.по умолч.для username
  {
    hooks: {
      beforeCreate: (user) => {
        if (!user.username) {
          return User.max('id').then((maxId) => {
            user.id = maxId ? maxId + 1 : 1;
            user.username =
              'БезИмённый_' + user.id + '--' + user.email.split('@')[0] + '';
          });
        }
      },
    },
  },
);

/* // ? должна быть */ // связь между Польз. и Корзиной через промежуточную таблицу token у этой таблицы будет составной первичный ключ (user_id + basket_id)
const Token = sequelize.define('token', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  // ссылка на id Польз., не резреш.0
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  // ссылка на id Корзины
  basketId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  // `обновлять` токен созд.в БД
  refreshToken: {
    type: DataTypes.STRING(300),
    // required: true
  },
  // ipАдрес входа, `Отпечаток пальца` браузера,..
});

// ^ добав.табл.расшир.доступов (темы, доп.меню, клвш.команд, доп.стр./Комп. и т.д.)
const Role = sequelize.define('role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // по умолч. роль USER и уникальна
  // value: { type: String, unique: true, default: "USER" },
  value: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    defaultValue: 'USER',
  },
  // описание
  description: {
    type: DataTypes.STRING,
  },
});

// связующая табл.|модель для User|Role. Внешн.ключи sequelize.`определит`
const UserRole = sequelize.define('user_role', {
  id: { type: DataTypes.INTEGER, /* primaryKey: true, */ autoIncrement: true },
  // ссылка на id Польз., не резреш.0
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  // ссылка на id Корзины
  roleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  level: { type: DataTypes.INTEGER, defaultValue: 1 },
});

// модель «Корзина», таблица БД «baskets»
const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// связь между корзиной и товаром через промежуточную таблицу «basket_products» у этой таблицы будет составной первичный ключ (basket_id + product_id)
const BasketProduct = sequelize.define('basket_product', {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
});

// модель «Категория», таблица БД «categories»
const Category = sequelize.define('category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // тип строка, уникальное, не пустое
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// модель «Бренд», таблица БД «brands»
const Brand = sequelize.define('brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// связь между товаром и пользователем через промежуточную таблицу «rating» у этой таблицы будет составной первичный ключ (product_id + user_id)
const Rating = sequelize.define('rating', {
  // id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.STRING, allowNull: false },
});

// модель «Товар», таблица БД «products»
const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  image: { type: DataTypes.STRING, allowNull: false },
});

// свойства товара, у одного товара может быть много свойств
const ProductProp = sequelize.define('product_prop', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.STRING, allowNull: false },
});

// модель «Заказ», таблица БД «orders»
const Order = sequelize.define('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT /* INTEGER */, allowNull: false }, // ^ FLOAT чтоб большие суммы проходили
  status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  comment: { type: DataTypes.STRING },
  // ^ Формат даты заказа. Виртуал.поля (prettyCreatedAt, prettyUpdatedAt), берут значение createdAt, updatedAt и форматируют.
  prettyCreatedAt: {
    type: DataTypes.VIRTUAL,
    get() {
      // return this.getDataValue("createdAt").toLocaleString("ru-RU");
      // ^ любой формат
      const value = (this as any)
        .getDataValue('createdAt')
        .toLocaleString('ru-RU');
      const day = value.getDate();
      const month = value.getMonth() + 1;
      const year = value.getFullYear();
      const hours = value.getHours();
      const minutes = value.getMinutes();
      // return day + "." + month + "." + year + " " + hours + ":" + minutes;
      const paddedMonth = month < 10 ? `0${month}` : month;
      const paddedHours = hours < 10 ? `0${hours}` : hours;
      const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${day}.${paddedMonth}.${year} ${paddedHours}:${paddedMinutes}`;
    },
  },
  prettyUpdatedAt: {
    type: DataTypes.VIRTUAL,
    get() {
      // return this.getDataValue("updatedAt").toLocaleString("ru-RU");
      // ^ любой формат
      const value = (this as any)
        .getDataValue('updatedAt')
        .toLocaleString('ru-RU');
      const day = value.getDate();
      const month = value.getMonth() + 1;
      const year = value.getFullYear();
      const hours = value.getHours();
      const minutes = value.getMinutes();
      // return day + "." + month + "." + year + " " + hours + ":" + minutes;
      const paddedMonth = month < 10 ? `0${month}` : month;
      const paddedHours = hours < 10 ? `0${hours}` : hours;
      const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${day}.${paddedMonth}.${year} ${paddedHours}:${paddedMinutes}`;
    },
  },
});

// позиции заказа, в одном заказе может быть несколько позиций (товаров)
const OrderItem = sequelize.define('order_item', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT /* INTEGER */, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
});

// const UserToken = sequelize.define("user_token", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   // refreshToken: { type: DataTypes.STRING },
// });

// const UserBasket = sequelize.define("user_basket", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   // refreshToken: { type: DataTypes.STRING },
// });

/*
 * Описание связей
 */

// польз.и корзина связь один к одному(одна корзина) | корзина принадлеж.польз.
// User.hasOne(Basket /* , { as: "basket", onDelete: "CASCADE" } */);
// foreignKey: 'myFooId',
// foreignKey: {
//   name: 'myFooId',
// },
// ^ При определении синонимов для ассоциаций hasOne() или belongsTo(), следует использовать сингулярную форму (единственное число)
// Basket.belongsTo(User);

// польз.и токен. связь один к одному(один польз) | токен принадлеж. 1му польз.
// User.hasOne(Token);
// Token.belongsTo(User);

// связь many-to-many User и Role через промежуточную таблицу user_roles;
// у Польз.может быть несколько Ролей, у Роли может быть несколько Польз.
User.belongsToMany(Role, { through: UserRole, onDelete: 'CASCADE' });
Role.belongsToMany(User, { through: UserRole, onDelete: 'CASCADE' });
// super many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
// это обеспечит возможность любых include при запросах findAll, findOne, findByPk
User.hasMany(UserRole);
UserRole.belongsTo(User);
Role.hasMany(UserRole);
UserRole.belongsTo(Role);

// связь many-to-many товаров и пользователей через промежуточную таблицу token;
// за один товар могут проголосовать несколько зарегистрированных пользователей, один пользователь может проголосовать за несколько товаров
User.hasOne(Basket, { through: Token, onDelete: 'CASCADE' });
Basket.belongsTo(User, { through: Token, onDelete: 'CASCADE' });
// super many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
// это обеспечит возможность любых include при запросах findAll, findOne, findByPk
User.hasMany(Token);
Token.belongsTo(User);
Basket.hasMany(Token);
Token.belongsTo(Basket);

// связь many-to-many товаров и корзин через промежуточную таблицу basket_products;
// товар может быть в нескольких корзинах, в корзине может быть несколько товаров
Basket.belongsToMany(Product, { through: BasketProduct, onDelete: 'CASCADE' });
Product.belongsToMany(Basket, { through: BasketProduct, onDelete: 'CASCADE' });
// super many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
// это обеспечит возможность любых include при запросах findAll, findOne, findByPk
Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);
Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);

// связь категории с товарами: в категории может быть несколько товаров, но каждый товар может принадлежать только одной категории
Category.hasMany(Product, { onDelete: 'RESTRICT' });
Product.belongsTo(Category);

// связь бренда с товарами: у бренда может быть много товаров, но каждый товар может принадлежать только одному бренду
Brand.hasMany(Product, { onDelete: 'RESTRICT' });
Product.belongsTo(Brand);

// связь many-to-many товаров и пользователей через промежуточную таблицу rating;
// за один товар могут проголосовать несколько зарегистрированных пользователей, один пользователь может проголосовать за несколько товаров
Product.belongsToMany(User, { through: Rating, onDelete: 'CASCADE' });
User.belongsToMany(Product, { through: Rating, onDelete: 'CASCADE' });

// super many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
// это обеспечит возможность любых include при запросах findAll, findOne, findByPk
Product.hasMany(Rating /* , { as: "rating", onDelete: "RESTRICT" } */);
Rating.belongsTo(Product);
User.hasMany(Rating /* , { as: "rating", onDelete: "RESTRICT" } */);
Rating.belongsTo(User);

// связь товара с его свойствами: у товара может быть несколько свойств, но каждое свойство связано только с одним товаром
Product.hasMany(ProductProp, { as: 'props', onDelete: 'CASCADE' });
ProductProp.belongsTo(Product);

// связь заказа с позициями: в заказе может быть несколько позиций, но
// каждая позиция связана только с одним заказом
Order.hasMany(OrderItem, { as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);

// связь заказа с пользователями: у пользователя может быть несколько заказов,
// но заказ может принадлежать только одному пользователю
User.hasMany(Order, { as: 'orders', onDelete: 'SET NULL' });
Order.belongsTo(User);

export {
  User,
  Role,
  UserRole,
  // UserBasket,
  Token,
  Category,
  Brand,
  Rating,
  Product,
  ProductProp,
  Basket,
  BasketProduct,
  Order,
  OrderItem,
};
