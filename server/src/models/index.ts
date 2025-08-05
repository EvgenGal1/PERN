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
    console.log('[DEBUG] Начало инициализации моделей');
    console.log('[DEBUG] models object:', models);

    // Защита от undefined
    if (!models) {
      throw new Error('[DEBUG] models object is undefined!');
    }

    // Проверим каждую модель отдельно
    Object.entries(models).forEach(([modelName, model]) => {
      console.log(`[DEBUG] Проверка модели ${modelName}:`, {
        exists: !!model,
        type: typeof model,
        keys: model ? Object.keys(model) : 'N/A',
      });

      if (!model) {
        console.warn(`[WARN] Модель ${modelName} не определена!`);
        return;
      }

      if (typeof model.initModel === 'function') {
        console.log(`[DEBUG] Инициализация модели: ${modelName}`);
        model.initModel(sequelize);
      } else {
        console.warn(`[WARN] Модель ${modelName} не имеет метода initModel`);
      }
    });

    // Аналогично для ассоциаций
    Object.entries(models).forEach(([modelName, model]) => {
      if (!model) {
        console.warn(`Ассоцияция в Моделе ${modelName} не определена!`);
        return;
      }
      if (typeof model.associate === 'function') {
        console.log(`[DEBUG] Установка ассоциаций для: ${modelName}`);
        model.associate(models);
      }
    });

    console.log('[DEBUG] Модели успешно инициализированы');
  } catch (error) {
    console.error('[ERROR] Ошибка при инициализации моделей:', error);
    throw error;
  }
}

export default initModels;
