// ^ ORM (Object-relational mapping `Объектно-реляционное отображение`).
// ^ Tok. модели данных табл. (подобие modelsTS/JS)
import sequelize from "../sequelize";
import database from "sequelize";

const { DataTypes, Sequelize } = database;
// import { DataTypes, Sequelize } from database;

/*
 * Описание моделей
 */

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  // `активируется` - подтвержд.почты от польз.
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  // `Ссылка активации` - хран.ссылку для актив.
  activationLink: { type: DataTypes.STRING, defaultValue: "нет mappTS" },
});

// модель «Корзина», таблица БД «baskets»
const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// связь между корзиной и товаром через промежуточную таблицу «basket_products» у этой таблицы будет составной первичный ключ (basket_id + product_id)
const BasketProduct = sequelize.define("basket_product", {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
});

// модель «Категория», таблица БД «categories»
const Category = sequelize.define("category", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// модель «Бренд», таблица БД «brands»
const Brand = sequelize.define("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// связь между товаром и пользователем через промежуточную таблицу «rating» у этой таблицы будет составной первичный ключ (product_id + user_id)
const Rating = sequelize.define("rating", {
  rate: { type: DataTypes.FLOAT, allowNull: false },
});

// модель «Товар», таблица БД «products»
const Product = sequelize.define("product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 0 },
  image: { type: DataTypes.STRING, allowNull: false },
});

// свойства товара, у одного товара может быть много свойств
const ProductProp = sequelize.define("product_prop", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.STRING, allowNull: false },
});

// модель «Заказ», таблица БД «orders»
const Order = sequelize.define("order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  comment: { type: DataTypes.STRING },
  // ^ Формат даты заказа
  // ^ 1ый способ. getter-ы для полей createdAt и updatedAt при определении модели «Заказ»:
  // ! откл.т.к.необход.форматировать даты-времени для каждого запроса, если нужно показать их пользователю
  // createdAt: {
  //   type: DataTypes.DATE,
  //   get() {
  //     return this.getDataValue("createdAt").toLocaleString("ru-RU", {
  //       timeZone: "Europe/Moscow",
  //     });
  //   },
  // },
  // updatedAt: {
  //   type: DataTypes.DATE,
  //   get() {
  //     return this.getDataValue("updatedAt").toLocaleString("ru-RU", {
  //       timeZone: "Europe/Moscow",
  //     });
  //   },
  // },
  // ^ 2ый способ. виртуал.поля (prettyCreatedAt, prettyUpdatedAt), берут значение createdAt, updatedAt и форматируют.
  prettyCreatedAt: {
    type: DataTypes.VIRTUAL,
    get() {
      // return this.getDataValue("createdAt").toLocaleString("ru-RU");
      // ^ любой формат
      const value = this.getDataValue("createdAt");
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
      const value = this.getDataValue("updatedAt");
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
const OrderItem = sequelize.define("order_item", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
});

/*
 * Описание связей
 */

// связь many-to-many товаров и корзин через промежуточную таблицу basket_products;
// товар может быть в нескольких корзинах, в корзине может быть несколько товаров
Basket.belongsToMany(Product, { through: BasketProduct, onDelete: "CASCADE" });
Product.belongsToMany(Basket, { through: BasketProduct, onDelete: "CASCADE" });

// super many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
// это обеспечит возможность любых include при запросах findAll, findOne, findByPk
Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);
Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);

// связь категории с товарами: в категории может быть несколько товаров, но каждый товар может принадлежать только одной категории
Category.hasMany(Product, { onDelete: "RESTRICT" });
Product.belongsTo(Category);

// связь бренда с товарами: у бренда может быть много товаров, но каждый товар может принадлежать только одному бренду
Brand.hasMany(Product, { onDelete: "RESTRICT" });
Product.belongsTo(Brand);

// связь many-to-many товаров и пользователей через промежуточную таблицу rating;
// за один товар могут проголосовать несколько зарегистрированных пользователей, один пользователь может проголосовать за несколько товаров
Product.belongsToMany(User, { through: Rating, onDelete: "CASCADE" });
User.belongsToMany(Product, { through: Rating, onDelete: "CASCADE" });

// super many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
// это обеспечит возможность любых include при запросах findAll, findOne, findByPk
Product.hasMany(Rating);
Rating.belongsTo(Product);
User.hasMany(Rating);
Rating.belongsTo(User);

// связь товара с его свойствами: у товара может быть несколько свойств, но каждое свойство связано только с одним товаром
Product.hasMany(ProductProp, { as: "props", onDelete: "CASCADE" });
ProductProp.belongsTo(Product);

// связь заказа с позициями: в заказе может быть несколько позиций, но
// каждая позиция связана только с одним заказом
Order.hasMany(OrderItem, { as: "items", onDelete: "CASCADE" });
OrderItem.belongsTo(Order);

// связь заказа с пользователями: у пользователя может быть несколько заказов,
// но заказ может принадлежать только одному пользователю
User.hasMany(Order, { as: "orders", onDelete: "SET NULL" });
Order.belongsTo(User);

export {
  /* default */ User,
  Basket,
  Product,
  Category,
  Brand,
  Rating,
  BasketProduct,
  ProductProp,
  Order,
  OrderItem,
};
