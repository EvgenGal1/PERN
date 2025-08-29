// модель данных табл.User
import UserModel from '../models/UserModel';
// serv разные
import RoleService from './role.service';
import BasketService from './basket.service';
// type/dto
import {
  UserCreateDto,
  UserUpdateDto,
  UserData,
} from '../types/user.interface';
import { ROLES_CONFIG } from '../config/api/roles.config';
// обраб.ошб.
import type { RoleName } from '../types/role.interface';
import ApiError from '../middleware/errors/ApiError';

class UserService {
  async getOneUser(id: number): Promise<UserModel> {
    const user = await UserModel.findByPk(id, {
      attributes: [
        'id',
        'username',
        'email',
        'phoneNumber',
        'clientId',
        'isActivated',
        'activationLink',
      ],
    });
    if (!user) throw ApiError.notFound(`Пользователь с ID '${id}' не найден`);
    return user;
  }

  async getAllUsers(): Promise<UserData[]> {
    const users = await UserModel.findAll({
      attributes: [
        'id',
        'username',
        'email',
        'phoneNumber',
        'clientId',
        'isActivated',
        'activationLink',
      ],
    });
    if (!users.length) throw ApiError.notFound('Пользователи не найдены');
    return users;
  }

  async createUser(data: UserCreateDto): Promise<UserData> {
    const {
      email,
      password,
      username = '',
      role = ROLES_CONFIG.USER.name,
      phoneNumber = '',
    } = data;

    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser)
      throw ApiError.conflict(`Пользователь с email ${email} существует`);

    const user = await UserModel.create({
      email,
      password,
      username,
      phoneNumber,
      clientId: '',
    });

    // параллел.req > созд.Корзину по User.id, привязка к Роли
    await Promise.all([
      BasketService.createBasket(user.id),
      RoleService.assignUserRole(user.id, role as RoleName),
    ]);

    return user;
  }

  async updateUser(id: number, data: UserUpdateDto): Promise<UserData> {
    const user = await this.getOneUser(id);
    // опцион.св-ва по модели
    const updatePayload: Partial<UserCreateDto> = {};
    // наполн.объ.обнов.
    if (data.email) updatePayload.email = data.email;
    if (data.password) updatePayload.password = data.password;
    if (data.username) updatePayload.username = data.username;
    if (data.phoneNumber) updatePayload.phoneNumber = data.phoneNumber;
    // параллел.req > обнов.Пользователя, привязка к Роли
    await Promise.all([
      user.update(updatePayload),
      data.role && RoleService.assignUserRole(id, data.role as RoleName),
    ]);

    return this.getOneUser(id);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getOneUser(id);
    await user.destroy();
  }

  // поиск по email
  async getByEmail(email: string): Promise<UserModel> {
    const user = await UserModel.findOne({ where: { email } });
    if (!user)
      throw ApiError.notFound(`Пользователь с email '${email}' не найден`);
    return user;
  }
}

export default new UserService();
