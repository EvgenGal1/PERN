// ^^ различные/помошники Утилиты База Данных
import {
  User as UserModel,
  Token as TokenModel,
  Role as RoleModel,
  UserRole as UserRoleModel,
  Basket as BasketModel,
} from "../models/model";

class DatabaseUtils {
  // ^^ `получить наименьший доступный идентификатор` из табл.БД>tableName
  async getSmallestIDAvailable(tableName: string): Promise<number> {
    // перем.таблц.
    let model;
    // выбор.табл.>tableName
    if (tableName === "user") model = UserModel;
    else if (tableName === "token") model = TokenModel;
    else if (tableName === "role") model = RoleModel;
    else if (tableName === "userrole") model = UserRoleModel;
    else if (tableName === "basket") model = BasketModel;
    else throw new Error("Неверное название таблицы");
    // req.составной
    const result = await model.findAll({ order: [["id", "ASC"]] });
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
}

export default new DatabaseUtils();
