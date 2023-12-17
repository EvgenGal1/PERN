import { Role as RoleModel, UserRole as UserRoleModel } from "../models/model";
import AppError from "../error/ApiError";
import DatabaseUtils from "../utils/database.utils";

class RoleService {
  async getAllRole() {
    const roles = await RoleModel.findAll();
    return roles;
  }

  async getOneRole(id) {
    const role = await RoleModel.findByPk(id);
    if (!role) {
      throw new Error("Роль не найден в БД");
    }
    return role;
  }

  // `назначать` неск.Польз. неск.Ролей
  async assignUserRole(userId, roleParam, level = 1) {
    try {
      // перем.Роли, поиск по ID|name
      let role;
      if (!isNaN(parseInt(roleParam))) {
        role = await roleParam.findOne({ where: { id: roleParam } });
      } else if (typeof roleParam === "string") {
        role = await RoleModel.findOne({ where: { value: roleParam } });
      }
      // `получить наименьший доступный идентификатор` из табл.БД
      const smallestFreeId = await DatabaseUtils.getSmallestIDAvailable(
        "userrole"
      );
      // созд.связь user-role
      const createdUserRole = await UserRoleModel.create({
        id: smallestFreeId,
        userId: userId.toString(),
        roleId: role.id,
        level,
      });
      // обраб.ошб.
      if (!createdUserRole || createdUserRole === 0) {
        return AppError.badRequest(
          `НЕ удалось записать Роли до CATCH `,
          " -нет- "
        );
      }
      return createdUserRole;
    } catch (error) {
      const errorMessage = error.message.split("\n")[0];
      return AppError.badRequest(
        `НЕ удалось записать Роли ${error}`,
        errorMessage
      );
    }
  }

  async createRole(data) {
    const { name } = data;
    const exist = await RoleModel.findOne({ where: { name } });
    if (exist) {
      throw new Error("Роль уже есть");
    }
    const role = await RoleModel.create({ name });
    return role;
  }

  async updateRole(id, data) {
    const role = await RoleModel.findByPk(id);
    if (!role) {
      throw new Error("Роль не найден в БД");
    }
    const { name = role.name } = data;
    await role.update({ name });
    return role;
  }

  async deleteRole(id) {
    const role = await RoleModel.findByPk(id);
    if (!role) {
      throw new Error("Роль не найден в БД");
    }
    await role.destroy();
    return role;
  }
}

export default new RoleService();
