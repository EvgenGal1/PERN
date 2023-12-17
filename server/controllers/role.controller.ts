import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
import RoleService from "../services/role.service";

class RoleController {
  async getAllRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await RoleService.getAllRole();
      res.json(roles);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOneRole(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id Роли");
      }
      const role = await RoleService.getOneRole(req.params.id);
      res.json(role);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await RoleService.createRole(req.body);
      res.json(role);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id Роли");
      }
      const role = await RoleService.updateRole(req.params.id, req.body);
      res.json(role);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id Роли");
      }
      const role = await RoleService.deleteRole(req.params.id);
      res.json(role);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new RoleController();
