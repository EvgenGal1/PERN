// ^ различные/помошники Утилиты База Данных

import UserModel from '../models/UserModel';
import RoleModel from '../models/RoleModel';
import UserRoleModel from '../models/UserRoleModel';
import BasketModel from '../models/BasketModel';
import TokenModel from '../models/TokenModel';
import { BasketResponse } from '../types/basket.interface';
import ApiError from '../middleware/errors/ApiError';

class DatabaseUtils {
  // ^^ `получить наименьший доступный идентификатор` из табл.БД>tableName
  async getSmallestIDAvailable(tableName: string): Promise<number> {
    // перем.таблц.
    let model: any;
    // выбор.табл.>tableName
    if (tableName === 'user') model = UserModel;
    else if (tableName === 'role') model = RoleModel;
    else if (tableName === 'userrole') model = UserRoleModel;
    else if (tableName === 'basket') model = BasketModel;
    else if (tableName === 'token') model = TokenModel;
    else throw ApiError.internal('Неверное название таблицы');
    // req.составной
    const result = await model.findAll({ order: [['id', 'ASC']] });
    // обраб.0
    if (result.length === 0) return 1;
    // перем. начального доступного ID
    let id = 1;
    // перебор./сравн. начал.ID <> ID БД
    for (const item of result) {
      if (item.id > id) break;
      id++;
    }
    // возврат первого свободного ID
    return id;
  }

  // утилита форматир.res.корзины
  async formatBasketResponse(basket: BasketModel): Promise<BasketResponse> {
    return {
      id: basket.id,
      products:
        basket.products?.map((product: any) => {
          // проверка наличия BasketProductModel
          const quantity = product.BasketProductModel?.quantity;
          if (quantity === undefined) {
            console.error(
              `Ошибка: Отсутствует связь BasketProductModel для Продукта с id=${product.id}`,
            );
          }
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity ?? 0, // е/и связи нет - возврат 0
          };
        }) || [],
    };
  }
}

export default new DatabaseUtils();
