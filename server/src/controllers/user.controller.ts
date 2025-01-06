// подкл. валидацию
import { Request, Response, NextFunction } from 'express';

// services
import UserService from '../services/user.service';
// обраб.ошб.
import AppError from '../middleware/errors/ApiError';

class UserController {
  // пока отд.нет
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { email, password, role = 'USER' } = req.body;
    try {
      if (!email || !password) {
        throw new Error('Пустой email или пароль');
      }
      if (!['USER', 'ADMIN'].includes(role)) {
        throw new Error('Недопустимое значение роли');
      }

      // const hash = await bcrypt.hash(password, 5);
      const user = await UserService.createUser({
        email,
        // password: hash,
        password,
        role,
      });

      /* return */ res.json(user);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
  async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id пользователя');
      }
      const user = await UserService.getOneUser(+req.params.id);
      if (!user) {
        // Если служба возвращает null, значит, пользователь не найден, устанавливаем статус 404.
        return next(
          AppError.notFound(
            `Пользователь по id ${req.params.id} не найден в БД`,
          ),
        );
      }
      /* return */ res.json(user);
    } catch (error: unknown) {
      return next(AppError.internal('Ошибка при получении пользователя'));
    }
  }
  async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUser();
      res.json(users);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id пользователя');
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для обновления');
      }
      let { email, password, role } = req.body;
      if (role && !['USER', 'ADMIN'].includes(role)) {
        throw new Error('Недопустимое значение роли');
      }
      // if (password) {
      //   password = await bcrypt.hash(password, 5);
      // }
      const user = await UserService.updateUser(+req.params.id, {
        email,
        password,
        role,
      });
      res.json(user);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id пользователя');
      }
      const user = await UserService.deleteUser(+req.params.id);
      res.json(user);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
}

export default new UserController();
