import RoleModel from '../models/RoleModel';
import UserRoleModel from '../models/UserRoleModel';
import { UserRoleCreationAttributes } from '../models/sequelize-types';
import ApiError from '../middleware/errors/ApiError';
import DatabaseUtils from '../utils/database.utils';

class RoleService {
  async getAllRole() {
    try {
      const roles = await RoleModel.findAll();
      return roles;
    } catch (error: unknown) {
      throw ApiError.badRequest(
        `Роли не получены`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async getOneRole(id: number) {
    try {
      const role = (await RoleModel.findByPk(id)) as unknown as InstanceType<
        typeof RoleModel
      > & { name: string };
      if (!role) {
        throw new Error('Роль не найден в БД');
      }
      return role;
    } catch (error: unknown) {
      throw ApiError.badRequest(
        `Роль не получена`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  // получ.привязку UserRole
  async getOneUserRole(id: number, param?: string) {
    try {
      // перем.привязки
      let userRole;
      // определение привязки
      if (param && param.includes('user')) {
        userRole = await UserRoleModel.findOne({ where: { userId: id } });
      } else if (param && param.includes('role')) {
        userRole = await UserRoleModel.findOne({ where: { roleId: id } });
      } else if (param && param.includes('value')) {
        userRole = await UserRoleModel.findOne({ where: { level: id } });
      } else {
        userRole = await RoleModel.findByPk(id);
      }
      if (!userRole) {
        throw new Error('Роль не найден в БД');
      }
      return userRole;
    } catch (error: unknown) {
      throw ApiError.badRequest(
        `НЕ удалось записать Роли ${error}`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  // `назначать` неск.Польз. неск.Ролей
  async assignUserRole(
    userId: number,
    roleParam: string | number,
    level: number = 1,
  ): Promise<InstanceType<typeof UserRoleModel>> {
    try {
      // перем.Роли, поиск по ID|name
      let role: (InstanceType<typeof RoleModel> & { id: number }) | null = null;
      if (!isNaN(parseInt(roleParam as string))) {
        role = (await RoleModel.findOne({ where: { id: roleParam } })) as
          | (InstanceType<typeof RoleModel> & { id: number })
          | null;
      } else if (typeof roleParam === 'string') {
        role = (await RoleModel.findOne({ where: { value: roleParam } })) as
          | (InstanceType<typeof RoleModel> & { id: number })
          | null;
      }
      if (!role) {
        throw new ApiError(500, 'Роль не найдена');
      }
      // `получить наименьший доступный идентификатор` из табл.БД
      const smallestFreeId =
        await DatabaseUtils.getSmallestIDAvailable('userrole');
      // созд.связь user-role
      const createdUserRole = await UserRoleModel.create({
        id: smallestFreeId,
        userId: userId,
        roleId: role.id,
        level,
      });
      // обраб.ошб.
      if (!createdUserRole) {
        throw ApiError.badRequest(`НЕ удалось записать Роли`);
      }
      return createdUserRole;
    } catch (error: unknown) {
      throw ApiError.badRequest(
        `НЕ удалось записать Роли ${error}`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async createRole(data: any): Promise<UserRoleCreationAttributes> {
    try {
      const { name } = data;
      const exist = await RoleModel.findOne({ where: { value: name } });
      if (exist) {
        throw new Error('Роль уже есть');
      }
      const role = await RoleModel.create({
        value: name,
        description: name.toUpperCase(),
      });
      return role;
    } catch (error: unknown) {
      throw ApiError.badRequest(
        `Роль не создана`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async updateRole(id: number, data: any) {
    try {
      const role = (await RoleModel.findByPk(
        id,
      )) as unknown as typeof RoleModel & { name: string };
      if (!role) {
        throw new Error('Роль не найден в БД');
      }
      const { name = role.name } = data;
      await role.update({ value: name }, { where: { id }, returning: true });
      return role;
    } catch (error: unknown) {
      throw ApiError.badRequest(
        `Роль не обновлена`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async deleteRole(id: number) {
    try {
      const role = await RoleModel.findByPk(id);
      if (!role) {
        throw new Error('Роль не найден в БД');
      }
      await role.destroy();
      return role;
    } catch (error: unknown) {
      throw ApiError.badRequest(
        `Роль не удалена`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
}

export default new RoleService();
