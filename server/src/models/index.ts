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

// масс.всех моделей
const models = {
  UserModel,
  TokenModel,
  RoleModel,
  UserRoleModel,
  BasketModel,
  BasketProductModel,
  ProductModel,
  CategoryModel,
  BrandModel,
  RatingModel,
  OrderModel,
  ProductPropModel,
  OrderItemModel,
};

// fn инициализ.модулей/устан.ассоциация
function initModels() {
  try {
    // инициализ.всех модулей ч/з экземп.Sequelize
    Object.values(models).forEach((model) => {
      if (typeof model.initModel === 'function') {
        console.log(`Инициализация модели: ${model.name}`);
        model.initModel(sequelize);
      }
    });

    // устан.ассоциаций/связей м/у моделями
    Object.values(models).forEach((model) => {
      if (typeof model.associate === 'function') {
        // console.log(`Установка ассоциаций для: ${model.name}`);
        model.associate(models);
      }
    });
    // console.log('Модели успешно инициализированы и ассоциации установлены.');
  } catch (error) {
    console.error('Ошибка при инициализации моделей:', error);
  }
}

export default initModels;
