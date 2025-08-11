import { Request, Response, NextFunction } from 'express';

import SecretCommandService from '../services/secretCommand.service';
import ApiError from '../middleware/errors/ApiError';

class SecretCommandController {
  /** отдать масс. кмд./комбин. доступных Пользователю по его Роли/Уровню */
  async getAvailableCommands(req: Request, res: Response, next: NextFunction) {
    try {
      const userRoles = req.auth?.roles;

      if (!userRoles) throw ApiError.internal('Роли Пользователя не найдены');

      const сmds = await SecretCommandService.getAvailableCommands(userRoles);

      res.status(200).json({
        message: 'Доступные кмд. извлечены',
        data: сmds,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SecretCommandController();
