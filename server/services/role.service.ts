import { Role as RoleModel, UserRole as UserRoleModel } from '../models/model';
import AppError from '../error/ApiError';
import DatabaseUtils from '../utils/database.utils';

class RoleService {
  async getAllRole() {
    try {
      const roles = await RoleModel.findAll();
      return roles;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Роли не получены`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async getOneRole(id) {
    try {
      const role = await RoleModel.findByPk(id);
      if (!role) {
        throw new Error('Роль не найден в БД');
      }
      return role;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Роль не получена`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  // получ.привязку UserRole
  async getOneUserRole(id: number, param?: string) {
    try {
      // перем.Привязки
      let userRole;
      // определение привязки
      if (param && param.includes('user')) {
        userRole = await UserRoleModel.findOne({ where: { user_id: id } });
      } else if (param && param.includes('role')) {
        userRole = await RoleModel.findOne({ where: { roleId: id } });
      } else if (param && param.includes('value')) {
        userRole = await RoleModel.findOne({ where: { level: id } });
      } else {
        userRole = await RoleModel.findOne(id);
      }
      if (!userRole) {
        throw new Error('Роль не найден в БД');
      }
      return userRole;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `НЕ удалось записать Роли ${error}`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  // `назначать` неск.Польз. неск.Ролей
  async assignUserRole(userId, roleParam, level = 1) {
    try {
      // перем.Роли, поиск по ID|name
      let role;
      if (!isNaN(parseInt(roleParam))) {
        role = await roleParam.findOne({ where: { id: roleParam } });
      } else if (typeof roleParam === 'string') {
        role = await RoleModel.findOne({ where: { value: roleParam } });
      }
      // `получить наименьший доступный идентификатор` из табл.БД
      const smallestFreeId =
        await DatabaseUtils.getSmallestIDAvailable('userrole');
      // созд.связь user-role
      const createdUserRole = await UserRoleModel.create({
        id: smallestFreeId,
        userId: userId.toString(),
        roleId: role.id,
        level,
      });
      // обраб.ошб.
      if (!createdUserRole || createdUserRole === 0) {
        throw AppError.badRequest(
          `НЕ удалось записать Роли до CATCH `,
          ' -нет- ',
        );
      }
      return createdUserRole;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `НЕ удалось записать Роли ${error}`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async createRole(data) {
    try {
      const { name } = data;
      const exist = await RoleModel.findOne({ where: { name } });
      if (exist) {
        throw new Error('Роль уже есть');
      }
      const role = await RoleModel.create({ name });
      return role;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Роль не создана`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async updateRole(id, data) {
    try {
      const role = await RoleModel.findByPk(id);
      if (!role) {
        throw new Error('Роль не найден в БД');
      }
      const { name = role.name } = data;
      await role.update({ name });
      return role;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Роль не обновлена`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async deleteRole(id) {
    try {
      const role = await RoleModel.findByPk(id);
      if (!role) {
        throw new Error('Роль не найден в БД');
      }
      await role.destroy();
      return role;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Роль не удалена`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
}

export default new RoleService();
