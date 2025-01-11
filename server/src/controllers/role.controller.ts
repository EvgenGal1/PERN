import { Request, Response, NextFunction } from 'express';

import ApiError from '../middleware/errors/ApiError';
import RoleService from '../services/role.service';

class RoleController {
  async getAllRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await RoleService.getAllRole();
      res.json(roles);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async getOneRole(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id Роли');
      }
      const role = await RoleService.getOneRole(+req.params.id);
      res.json(role);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await RoleService.createRole(req.body);
      res.json(role);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id Роли');
      }
      const role = await RoleService.updateRole(+req.params.id, req.body);
      res.json(role);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id Роли');
      }
      const role = await RoleService.deleteRole(+req.params.id);
      res.json(role);
    } catch (error: unknown) {
      next(
        ApiError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
}

export default new RoleController();
