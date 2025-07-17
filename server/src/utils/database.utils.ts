// ^ различные/помошники Утилиты База Данных

import { Transaction } from 'sequelize';

import UserModel from '../models/UserModel';
import RoleModel from '../models/RoleModel';
import UserRoleModel from '../models/UserRoleModel';
import BasketModel from '../models/BasketModel';
import ProductModel from '../models/ProductModel';
import BasketProductModel from '../models/BasketProductModel';
import TokenModel from '../models/TokenModel';
import OrderModel from '../models/OrderModel';
import OrderItemModel from '../models/OrderItemModel';
import type {
  BasketProduct,
  BasketResponse,
  BasketWithProducts,
} from '../types/basket.interface';
import ApiError from '../middleware/errors/ApiError';

class DatabaseUtils {
  // получ.Модуль > getSmallestIDAvailable
  private static modelMap: Record<string, any> = {
    user: UserModel,
    role: RoleModel,
    userrole: UserRoleModel,
    basket: BasketModel,
    token: TokenModel,
    order: OrderModel,
    order_item: OrderItemModel,
  };

  /**
   * получить наименьший доступный ID в указ.табл.
   * @param tableName - Название таблицы
   * @param transaction - Опциональная транзакция
   * @returns Promise<number> - Наименьший свободный ID
   */
  async getSmallestIDAvailable(
    tableName: keyof typeof DatabaseUtils.modelMap,
    transaction?: Transaction,
  ): Promise<number> {
    // перем. выбора табл.
    const model = DatabaseUtils.modelMap[tableName];
    if (!model)
      throw ApiError.internal(`Неверное название таблицы: ${tableName}`);

    // req.составной
    const result = await model.findAll({
      attributes: ['id'],
      order: [['id', 'ASC']],
      transaction,
      raw: true, // ускоряет запрос
    });
    // обраб.0
    if (result.length === 0) return 1;
    // перем. начального доступного ID
    let id = 1;
    // перебор./сравн. начал.ID <> ID БД
    for (const item of result) {
      if (item.id > id) break;
      id = item.id + 1;
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
    const total =
      products.reduce((sum, p) => sum + p.price * p.quantity, 0) || 0;
    // возврат данн.с фикс.тчк.в сумме
    return { ...base, products, total: Number(total.toFixed(2)) };
  }
}

export default new DatabaseUtils();
