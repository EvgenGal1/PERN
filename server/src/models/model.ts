// ^ ORM (Object-relational mapping `Объектно-реляционное отображение`).
// ^ модели данных табл. (подобие modelsTS/JS)

import sequelize from '../config/sequelize';
import { DataTypes, Model } from 'sequelize';
import {
  BasketAttributes,
  BasketProductAttributes,
  BrandAttributes,
  CategoryAttributes,
  OrderAttributes,
  OrderItemAttributes,
  ProductAttributes,
  ProductPropAttributes,
  RatingAttributes,
  TokenAttributes,
  UserAttributes,
  RoleAttributes,
  UserRoleAttributes,
  UserRoleCreationAttributes,
  RoleCreationAttributes,
  OrderCreationAttributes,
  CategoryCreationAttributes,
  TokenCreationAttributes,
  UserCreationAttributes,
  OrderItemCreationAttributes,
} from './sequelize-types';

/*
 * Описание моделей
 */

const UserModel = sequelize.define<
  Model<UserAttributes, UserCreationAttributes>
>(
  'user',
  {
    // тип целое число, перв.ключ, авто.добавка
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // добавил name, удалить можно через pgAdmin, залить сначала удалив табл.с привязками DROP TABLE IF EXISTS users CASCADE;
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    // тип строка, уникальное, обязательно
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    // `активируется` - подтвержд.почты от польз.
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    // `Ссылка активации` - хран.ссылку для актив.
    activationLink: { type: DataTypes.STRING, defaultValue: 'нет ссылки' },
  },
  // знач.по умолч.для username
  {
    hooks: {
      beforeCreate: (user: any): any => {
        if (!user.username) {
          return UserModel.max('id').then(
            (maxId /* : number | null */ : any) => {
              user.id = maxId ? maxId + 1 : 1;
              user.username =
                'БезИмённый_' + user.id + '--' + user.email.split('@')[0] + '';
            },
          );
        }
      },
    },
  },
);

// связь между Польз. и Корзиной через промежуточную таблицу token у этой таблицы будет составной первичный ключ (user_id + basket_id)
const TokenModel = sequelize.define<
  Model<TokenAttributes, TokenCreationAttributes>
>('token', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
    allowNull: true,
    // required: true
  },
});

// ^ добав.табл.расшир.доступов (темы, доп.меню, клвш.команд, доп.стр./Комп. и т.д.)
const RoleModel = sequelize.define<
  Model<RoleAttributes, RoleCreationAttributes>
>('role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // по умолч. роль USER и уникальна
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
const UserRoleModel = sequelize.define<
  Model<UserRoleAttributes, UserRoleCreationAttributes>
>('user_role', {
  id: { type: DataTypes.INTEGER, autoIncrement: true },
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
const BasketModel = sequelize.define<Model<BasketAttributes>>('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

// связь между корзиной и товаром через промежуточную таблицу «basket_products» у этой таблицы будет составной первичный ключ (basket_id + product_id)
const BasketProductModel = sequelize.define<Model<BasketProductAttributes>>(
  'basket_product',
  {
    basketId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    productId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
);

// модель «Категория», таблица БД «categories»
const CategoryModel = sequelize.define<
  Model<CategoryAttributes, CategoryCreationAttributes>
>('category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // тип строка, уникальное, не пустое
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// модель «Бренд», таблица БД «brands»
const BrandModel = sequelize.define<Model<BrandAttributes>>('brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// связь между товаром и пользователем через промежуточную таблицу «rating» у этой таблицы будет составной первичный ключ (product_id + user_id)
const RatingModel = sequelize.define<Model<RatingAttributes>>('rating', {
  rate: { type: DataTypes.STRING, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

// модель «Товар», таблица БД «products»
const ProductModel = sequelize.define<Model<ProductAttributes>>('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  image: { type: DataTypes.STRING, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
  brandId: { type: DataTypes.INTEGER, allowNull: true },
});

// свойства товара, у одного товара может быть много свойств
const ProductPropModel = sequelize.define<Model<ProductPropAttributes>>(
  'product_prop',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
  },
);

// модель «Заказ», таблица БД «orders»
const OrderModel = sequelize.define<
  Model<OrderAttributes, OrderCreationAttributes>
>('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false }, // ^ FLOAT чтоб большие суммы проходили
  status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  comment: { type: DataTypes.STRING },
  // userId: { type: DataTypes.INTEGER, allowNull: true },
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
      const paddedMonth = month < 10 ? `0${month}` : month;
      const paddedHours = hours < 10 ? `0${hours}` : hours;
      const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${day}.${paddedMonth}.${year} ${paddedHours}:${paddedMinutes}`;
    },
  },
});

// позиции заказа, в одном заказе может быть несколько позиций (товаров)
const OrderItemModel = sequelize.define<
  Model<OrderItemAttributes, OrderItemCreationAttributes>
>('order_item', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
});

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
UserModel.belongsToMany(RoleModel, {
  through: UserRoleModel,
  onDelete: 'CASCADE',
});
RoleModel.belongsToMany(UserModel, {
  through: UserRoleModel,
  onDelete: 'CASCADE',
});
// super many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
// это обеспечит возможность любых include при запросах findAll, findOne, findByPk
UserModel.hasMany(UserRoleModel);
UserRoleModel.belongsTo(UserModel);
RoleModel.hasMany(UserRoleModel);
UserRoleModel.belongsTo(RoleModel);

// связь many-to-many товаров и пользователей через промежуточную таблицу token;
// за один товар могут проголосовать несколько зарегистрированных пользователей, один пользователь может проголосовать за несколько товаров
UserModel.hasOne(BasketModel, { onDelete: 'CASCADE' });
BasketModel.belongsTo(UserModel, { onDelete: 'CASCADE' });
// super many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
// это обеспечит возможность любых include при запросах findAll, findOne, findByPk
UserModel.hasMany(TokenModel, { foreignKey: 'userId' });
TokenModel.belongsTo(UserModel, { foreignKey: 'userId' });
BasketModel.hasMany(TokenModel, { foreignKey: 'basketId' });
TokenModel.belongsTo(BasketModel, { foreignKey: 'basketId' });

// связь many-to-many товаров и корзин через промежуточную таблицу basket_products;
// товар может быть в нескольких корзинах, в корзине может быть несколько товаров
BasketModel.belongsToMany(ProductModel, {
  through: BasketProductModel,
  foreignKey: 'basketId',
  // onDelete: 'CASCADE',
});
ProductModel.belongsToMany(BasketModel, {
  through: BasketProductModel,
  foreignKey: 'productId',
  // onDelete: 'CASCADE',
});
// super many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
// это обеспечит возможность любых include при запросах findAll, findOne, findByPk
BasketModel.hasMany(BasketProductModel);
BasketProductModel.belongsTo(BasketModel);
ProductModel.hasMany(BasketProductModel);
BasketProductModel.belongsTo(ProductModel);

// связь категории с товарами: в категории может быть несколько товаров, но каждый товар может принадлежать только одной категории
CategoryModel.hasMany(ProductModel, {
  onDelete: 'RESTRICT',
  foreignKey: 'categoryId',
});
ProductModel.belongsTo(CategoryModel, { foreignKey: 'categoryId' });

// связь бренда с товарами: у бренда может быть много товаров, но каждый товар может принадлежать только одному бренду
BrandModel.hasMany(ProductModel, {
  onDelete: 'RESTRICT',
  foreignKey: 'brandId',
});
ProductModel.belongsTo(BrandModel, { foreignKey: 'brandId' });

// связь many-to-many товаров и пользователей через промежуточную таблицу rating;
// за один товар могут проголосовать несколько зарегистрированных пользователей, один пользователь может проголосовать за несколько товаров
ProductModel.belongsToMany(UserModel, {
  through: RatingModel,
  onDelete: 'CASCADE',
});
UserModel.belongsToMany(ProductModel, {
  through: RatingModel,
  onDelete: 'CASCADE',
});

// super many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
// это обеспечит возможность любых include при запросах findAll, findOne, findByPk
ProductModel.hasMany(
  RatingModel /* , { as: "rating", onDelete: "RESTRICT" } */,
);
RatingModel.belongsTo(ProductModel);
UserModel.hasMany(RatingModel /* , { as: "rating", onDelete: "RESTRICT" } */);
RatingModel.belongsTo(UserModel);

// связь товара с его свойствами: у товара может быть несколько свойств, но каждое свойство связано только с одним товаром
ProductModel.hasMany(ProductPropModel, {
  as: 'props',
  foreignKey: 'productId',
  onDelete: 'CASCADE',
});
ProductPropModel.belongsTo(ProductModel, { foreignKey: 'productId' });

// связь заказа с позициями: в заказе может быть несколько позиций, но
// каждая позиция связана только с одним заказом
OrderModel.hasMany(OrderItemModel, {
  as: 'items',
  foreignKey: 'orderId',
  onDelete: 'CASCADE',
});
OrderItemModel.belongsTo(OrderModel, { foreignKey: 'orderId' });

// связь заказа с пользователями: у пользователя может быть несколько заказов,
// но заказ может принадлежать только одному пользователю
UserModel.hasMany(OrderModel, { as: 'orders', onDelete: 'SET NULL' });
OrderModel.belongsTo(UserModel);

export {
  UserModel,
  RoleModel,
  UserRoleModel,
  TokenModel,
  CategoryModel,
  BrandModel,
  RatingModel,
  ProductModel,
  ProductPropModel,
  BasketModel,
  BasketProductModel,
  OrderModel,
  OrderItemModel,
};
