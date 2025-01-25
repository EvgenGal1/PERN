// подкл. валидацию
import { Request, Response, NextFunction } from 'express';

// services
import UserService from '../services/user.service';
// валид.данн.req
import { parseId, validateData } from '../utils/validators';
// перем. Ролей/уровней
import { NameUserRoles } from '../config/constants/roles';
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
      return next(ApiError.internal('Ошибка при получении пользователя'));
    }
  }

  async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUser();
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
      const { email, password, role = NameUserRoles.USER } = req.body;
      if (!email || !password) {
        throw ApiError.badRequest('Email и пароль обязательны');
      }
      if (![NameUserRoles.USER, NameUserRoles.ADMIN].includes(role)) {
        throw ApiError.badRequest('Недопустимое значение роли');
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
      if (role && ![NameUserRoles.USER, NameUserRoles.ADMIN].includes(role)) {
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
