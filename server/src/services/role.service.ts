import { Transaction } from 'sequelize';

import RoleModel from '../models/RoleModel';
import UserRoleModel from '../models/UserRoleModel';
import { ROLES_CONFIG } from '../config/api/roles.config';
import type {
  RoleDTO,
  RoleID,
  RoleLevels,
  RoleName,
} from '../types/role.interface';
import ApiError from '../middleware/errors/ApiError';

class RoleService {
  // ^ РОЛИ
  // получ.одну Роль по ID/имени
  async getOneRole(param: RoleID | RoleName): Promise<RoleModel> {
    const where = typeof param === 'number' ? { id: param } : { value: param };

    const role = await RoleModel.findOne({ where });
    if (!role) throw ApiError.notFound('Роль не найдена');
    return role;
  }

  // получ.Все Роли
  async getAllRoles(): Promise<RoleModel[]> {
    return RoleModel.findAll();
  }

  // создание Роли
  async createRole(data: RoleDTO): Promise<RoleModel> {
    const exist = await RoleModel.findOne({ where: { value: data.value } });
    if (exist) throw ApiError.conflict(`Роль '${data.value}' уже есть`);
    const role = await RoleModel.create({
      value: data.value,
      description: data.description || `${data.value.toUpperCase()} role`,
    });
    return role;
  }

  async updateRole(id: number, data: RoleDTO) {
    const role = await RoleModel.findByPk(id);
    if (!role) throw ApiError.notFound('Роль не найдена');
    // коп.данн.обнов. > исключ.пуст.описания
    const updateData = { ...data };
    if (!updateData.description) delete updateData.description;
    await role.update(updateData);
    return role;
  }

  async deleteRole(id: number) {
    const role = await RoleModel.findByPk(id);
    if (!role) throw ApiError.notFound('Роль не найдена');
    await role.destroy();
    return role;
  }

  // ^ ПОЛЬЗОВАТЕЛЬ/СВЯЗИ/УРОВНИ

  // получить Роли Пользователя
  async getAllUserRoles(userId: number): Promise<UserRoleModel[]> {
    const userRoles = await UserRoleModel.findAll({
      where: { userId },
      include: [RoleModel],
    });
    if (!userRoles.length) throw ApiError.notFound('У Пользователя нет Ролей');
    return userRoles;
  }

  // назначение связи Роли с Пользователем
  async assignUserRole(
    userId: number,
    roleName: RoleName,
    level: number = 1,
    transaction?: Transaction,
  ): Promise<UserRoleModel> {
    // по имени Роли из объ.взять ID
    const roleId = ROLES_CONFIG[roleName].id;
    // созд./обнов. связь user-role с защитой от дубликатов и возврат актуальной
    const [userRole] = await UserRoleModel.upsert(
      {
        userId,
        roleId,
        level,
      },
      {
        conflictFields: ['user_id', 'role_id'] as any, // имя стлб.без типа от ошб.не существ.userId
        returning: true,
        transaction,
      },
    );
    if (!userRole) {
      throw ApiError.badRequest(`Не удалось записать связь`);
    }
    return userRole;
  }

  // получ.масс.объ. Роли/уровни Пользователей
  async getUserRolesAndLevels(userId: number): Promise<RoleLevels[]> {
    const userRoles = await UserRoleModel.findAll({
      where: { userId },
      include: [{ model: RoleModel, as: 'role' }],
    });
    if (!userRoles) throw ApiError.notFound('Связи Пользователя не найден');
    return userRoles.map((ur) => ({
      role: ur.role!.value as RoleName,
      level: ur.level,
    }));
  }

  // проверка прав доступа Роли
  static async checkAccess(
    userRoles: RoleName[],
    requiredRole: RoleName,
  ): Promise<boolean> {
    // нахождение макс.уровня из Ролей Пользователя
    const userLevel = Math.max(
      ...userRoles.map((roleName) => ROLES_CONFIG[roleName].hierarchy),
      -1 /* На случай, если массив пуст */,
    );
    // сравнение с треб.уровнем
    return userLevel >= ROLES_CONFIG[requiredRole].hierarchy;
  }

  // обнов.уровень Роли Пользователя
  async updateUserRoleLevel(
    userId: number,
    roleName: RoleName,
    level: number,
  ): Promise<UserRoleModel> {
    const roleId = ROLES_CONFIG[roleName].id;
    const userRole = await UserRoleModel.findOne({
      where: { userId, roleId },
    });

    if (!userRole) throw ApiError.notFound('Связи с Ролью не найдено');
    return userRole.update({ level });
  }

  async removeUserRole(userId: number, roleName: RoleName): Promise<void> {
    const roleId = ROLES_CONFIG[roleName].id;
    await UserRoleModel.destroy({
      where: { userId, roleId },
    });
  }
}

export default new RoleService();
