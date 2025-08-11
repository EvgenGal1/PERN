import { Request, Response, NextFunction } from 'express';

import CommandService from '../services/command.service';
import ApiError from '../middleware/errors/ApiError';

class CommandController {
  /** отдать масс. кмд./комбин. доступных Пользователю по его Роли/Уровню */
  async getAvailableCommands(req: Request, res: Response, next: NextFunction) {
    try {
      const userRoles = req.auth?.roles;

      if (!userRoles) throw ApiError.internal('Роли Пользователя не найдены');

      const сmds = await CommandService.getAvailableCommands(userRoles);

      res.status(200).json({
        message: 'Доступные кмд. извлечены',
        data: сmds,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CommandController();
