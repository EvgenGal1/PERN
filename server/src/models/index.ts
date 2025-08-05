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
// import { isDevelopment } from '../config/envs/env.consts';

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
    // устан.Моделей
    Object.entries(models).forEach(([modelName, model]) => {
      // проверка на undefined/null
      if (!model) {
        console.warn(`Модель ${modelName} не определена!`);
        return;
      }
      // инициализ.всех модулей ч/з экземп.Sequelize
      if (typeof model.initModel === 'function') {
        // if (isDevelopment) console.log(`Инициализация модели: ${model.name}`);
        model.initModel(sequelize);
      }
    });

    // устан.ассоциаций/связей м/у Моделями
    Object.entries(models).forEach(([modelName, model]) => {
      if (!model) {
        console.warn(`Ассоцияция в Моделе ${modelName} не определена!`);
        return;
      }
      if (typeof model.associate === 'function') {
        // if (isDevelopment) console.log(`Установка ассоциаций для: ${model.name}`);
        model.associate(models);
      }
    });
    // if (isDevelopment) console.log('Модели успешно инициализированы и ассоциации установлены.');
  } catch (error) {
    console.error('Ошибка при инициализации моделей:', error);
    throw error;
  }
}

export default initModels;
