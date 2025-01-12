// ^ централизованная инициализация всех моделей и устанавка их связей

// подключение к БД
import sequelize from '../config/sequelize';
// модули
import UserModel from './UserModel';
import TokenModel from './TokenModel';
import RoleModel from './RoleModel';
import UserRoleModel from './UserRoleModel';
import BasketModel from './BasketModel';
import BasketProductModel from './BasketProductModel';
import ProductModel from './ProductModel';
import CategoryModel from './CategoryModel';
import BrandModel from './BrandModel';
import RatingModel from './RatingModel';
import OrderModel from './OrderModel';
import ProductPropModel from './ProductPropModel';
import OrderItemModel from './OrderItemModel';

// инициализация моделей
function initModels() {
  try {
    // инициализ.М.ч/з экземп.Sequelize
    UserModel.initModel(sequelize);
    TokenModel.initModel(sequelize);
    RoleModel.initModel(sequelize);
    UserRoleModel.initModel(sequelize);
    CategoryModel.initModel(sequelize);
    BrandModel.initModel(sequelize);
    ProductModel.initModel(sequelize);
    ProductPropModel.initModel(sequelize);
    BasketModel.initModel(sequelize);
    BasketProductModel.initModel(sequelize);
    RatingModel.initModel(sequelize);
    OrderModel.initModel(sequelize);
    OrderItemModel.initModel(sequelize);

    // устан.связей м/у моделями
    UserModel.associate();
    TokenModel.associate();
    RoleModel.associate();
    UserRoleModel.associate();
    CategoryModel.associate();
    BrandModel.associate();
    ProductModel.associate();
    ProductPropModel.associate();
    BasketModel.associate();
    BasketProductModel.associate();
    RatingModel.associate();
    OrderModel.associate();
    OrderItemModel.associate();
  } catch (error) {
    console.error('Ошибка при инициализации моделей:', error);
  }
}

export default initModels;
