// подкл. валидацию
import { Request, Response, NextFunction } from 'express';

// services
import UserService from '../services/user.service';
// валид.данн.req
import { parseId, validateData } from '../utils/validators';
// конфиг.Ролей
import { ROLES_CONFIG } from '../config/api/roles.config';
// обраб.ошб.
import ApiError from '../middleware/errors/ApiError';

class UserController {
  constructor() {
    // Привязка методов к контексту класса
    this.createUser = this.createUser.bind(this);
    this.getOneUser = this.getOneUser.bind(this);
    this.getAllUser = this.getAllUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  private readonly name = 'Пользователь';

  async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      const user = await UserService.getOneUser(id);
      if (!user) {
        throw ApiError.notFound(`Пользователь с ID ${id} не найден`);
      }
      res.status(200).json(user);
    } catch (error: unknown) {
      return next(ApiError.internal('Ошибка при получении Пользователя'));
    }
  }

  async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error: unknown) {
      next(error);
    }
  }

  // пока отд.нет
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      validateData(req.body, this.name);
      // использ.ROLES_CONFIG > знач.по умолчанию
      const { email, password, role = ROLES_CONFIG.USER.name } = req.body;
      if (!email || !password) {
        throw ApiError.badRequest('Email и пароль обязательны');
      }
      // проверка допуста Роли ч/з масс.ключей ROLES_CONFIG
      if (!Object.keys(ROLES_CONFIG).includes(role)) {
        throw ApiError.badRequest('Недопустимое значение Роли');
      }
      const user = await UserService.createUser({
        email,
        password,
        role,
      });
      res.status(201).json(user);
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      validateData(req.body, this.name);
      const { email, password, role } = req.body;
      if (role && !Object.keys(ROLES_CONFIG).includes(role)) {
        throw ApiError.badRequest('Недопустимое значение роли');
      }
      const user = await UserService.updateUser(id, { email, password, role });
      res.status(200).json(user);
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      const user = await UserService.deleteUser(id);
      res.status(200).json(user);
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new UserController();
