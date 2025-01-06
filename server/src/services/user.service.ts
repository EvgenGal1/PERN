// модель данных табл.User
import { UserModel } from '../models/model';
import { UserRoleModel } from '../models/model';
// serv разные
import BasketService from './basket.service';
// утилиты/helpы/обраб.ошб./dto
import AppError from '../middleware/errors/ApiError';
import { UserAttributes, UserCreationAttributes } from 'models/sequelize-types';
import { Model } from 'sequelize';

class UserService {
  async createUser(data: any) {
    try {
      const { email, password, role } = data;
      const check = await UserModel.findOne({ where: { email } });
      if (check)
        /* throw new Error // ! как-то не так отраб.*/
        throw AppError.badRequest('Пользователь уже существует');
      const user = await UserModel.create({ email, password, role });
      // созд.Корзину по User.id
      if (user.get('id')) await BasketService.createBasket(user.get('id'));
      return user;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Пользователь  не создан`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  async getOneUser(
    id: number,
  ): Promise<Model<UserAttributes, UserCreationAttributes> | null> {
    try {
      const user = await UserModel.findByPk(id);
      if (!user) {
        throw AppError.notFound(`Пользователь по id ${id} не найден в БД`);
      }
      return user;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Один Пользователь не прошёл`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  async getAllUser() {
    try {
      const users = await UserModel.findAll();
      return users;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Все Пользователи не прошли`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  async updateUser(id: number, data: any) {
    try {
      const user = await UserModel.findByPk(id /* , { raw: true } */);
      if (!user)
        return AppError.notFound(`Пользователь по id ${id} не найден в БД`);
      const {
        email = user./* email */ get('email'),
        password = user./* password */ get('password'),
        // ! заменить на роль из UserRoles
        role = user./* role */ get('role'),
      } = data;
      await user.update({ email, password });

      if (data.role) {
        await UserRoleModel.update(
          { roleId: data.role },
          { where: { userId: id } },
        );
      }

      return user;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Обновление Пользователя не прошло`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  async deleteUser(id: number) {
    try {
      const user = await UserModel.findByPk(id);
      if (!user) return AppError.badRequest('Пользователь не найден в БД');
      if (user.get('id')) BasketService.deleteBasket(user.get('id') as number);
      await user.destroy();
      return user;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `Удаление Пользователя не прошло`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
  // поиск по email
  async getByEmailUser(email: string) {
    try {
      const user = await UserModel.findOne({ where: { email } });
      if (!user)
        throw AppError.badRequest(
          `Пользователь с email ${email} не найден в БД`,
        );
      return user;
    } catch (error: unknown) {
      throw AppError.badRequest(
        `По email найти Пользователя не прошло`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }
}

export default new UserService();
