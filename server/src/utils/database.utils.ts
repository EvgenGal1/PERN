// ^ различные/помошники Утилиты База Данных

import UserModel from '../models/UserModel';
import RoleModel from '../models/RoleModel';
import UserRoleModel from '../models/UserRoleModel';
import BasketModel from '../models/BasketModel';
import ProductModel from '../models/ProductModel';
import BasketProductModel from '../models/BasketProductModel';
import TokenModel from '../models/TokenModel';
import {
  BasketProduct,
  BasketResponse,
  BasketWithProducts,
} from '../types/basket.interface';
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

  // утилита форматир.res.Корзины
  formatBasketResponse(basket: BasketWithProducts): BasketResponse {
    // базов.объ.возврата
    if (!basket) throw ApiError.badRequest('Неверный ввод корзины');
    const base: BasketResponse = {
      id: basket.id,
      userId: basket.userId,
      products: [] as BasketProduct[],
      total: 0,
    };
    if (!basket.products || !basket.products.length) return base;
    // созд.масс.Продуктов > подсчёта общ.суммы
    const products = basket.products.map(
      (p: ProductModel & { BasketProduct: BasketProductModel }) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: p.BasketProduct?.quantity || 0,
      }),
    );
    // подсчёт общ.суммы
    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    // возврат данн.с фикс.тчк.в сумме
    return { ...base, products, total: Number(total.toFixed(2)) };
  }
}

export default new DatabaseUtils();
