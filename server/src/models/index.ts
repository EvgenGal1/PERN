// ^ централизованная инициализация всех моделей и устанавка их связей

// подключение к БД
import sequelize from '../config/sequelize';
// модули
import UserModel from './UserModel';
import RoleModel from './RoleModel';
import UserRoleModel from './UserRoleModel';
import BasketModel from './BasketModel';
import TokenModel from './TokenModel';
import BrandModel from './BrandModel';
import CategoryModel from './CategoryModel';
import ProductModel from './ProductModel';
import ProductPropModel from './ProductPropModel';
import OrderModel from './OrderModel';
import OrderItemModel from './OrderItemModel';
import BasketProductModel from './BasketProductModel';
import RatingModel from './RatingModel';
// перем.окруж.
import { isDevelopment } from '../config/envs/env.consts';

// масс.всех моделей
const models = {
  UserModel,
  RoleModel,
  UserRoleModel,
  BasketModel,
  TokenModel,
  BrandModel,
  CategoryModel,
  ProductModel,
  ProductPropModel,
  OrderModel,
  OrderItemModel,
  BasketProductModel,
  RatingModel,
};

// fn инициализ.модулей/устан.ассоциация
function initModels() {
  try {
    // инициализ.всех модулей ч/з экземп.Sequelize
    Object.values(models).forEach((model) => {
      if (typeof model.initModel === 'function') {
        if (isDevelopment) console.log(`Инициализация модели: ${model.name}`);
        model.initModel(sequelize);
      }
    });

    // устан.ассоциаций/связей м/у моделями
    Object.values(models).forEach((model) => {
      if (typeof model.associate === 'function') {
        if (isDevelopment)
          console.log(`Установка ассоциаций для: ${model.name}`);
        model.associate(models);
      }
    });
    if (isDevelopment)
      console.log('Модели успешно инициализированы и ассоциации установлены.');
  } catch (error) {
    console.error('Ошибка при инициализации моделей:', error);
  }
}

export default initModels;
