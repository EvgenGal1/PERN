// модель данных табл.User
import UserModel from '../models/UserModel';
// serv разные
import RoleService from './role.service';
import BasketService from './basket.service';
// type/dto
import { UserCreateDto, UserUpdateDto } from '../types/user.interface';
import { NameUserRoles } from '../types/role.interface';
// обраб.ошб.
import ApiError from '../middleware/errors/ApiError';

class UserService {
  async createUser(data: UserCreateDto): Promise<UserModel> {
    const { email, password, username = '', role = NameUserRoles.USER } = data;

    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser)
      throw ApiError.conflict(`Пользователь с email ${email} существует`);

    const user = await UserModel.create({
      email,
      password,
      username,
    });

    // параллел.req > созд.Корзину по User.id, привязка к Роли
    await Promise.all([
      BasketService.createBasket(user.id),
      RoleService.assignUserRole(user.id, role as NameUserRoles),
    ]);

    return user;
  }

  async getOneUser(id: number): Promise<UserModel> {
    const user = await UserModel.findByPk(id);
    if (!user) throw ApiError.notFound(`Пользователь с ID '${id}' не найден`);
    return user;
  }

  async getAllUsers(): Promise<UserModel[]> {
    return UserModel.findAll();
  }

  async updateUser(id: number, data: UserUpdateDto): Promise<UserModel> {
    const user = await this.getOneUser(id);
    // опцион.св-ва по модели
    const updatePayload: Partial<UserModel> = {};
    // наполн.объ.обнов.
    if (data.email) updatePayload.email = data.email;
    if (data.password) updatePayload.password = data.password;
    if (data.username) updatePayload.username = data.username;
    // параллел.req > обнов.Пользователя, привязка к Роли
    await Promise.all([
      user.update(updatePayload),
      data.role && RoleService.assignUserRole(id, data.role as NameUserRoles),
    ]);

    return user;
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
