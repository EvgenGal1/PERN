import { Request, Response, NextFunction } from 'express';

import RoleService from '../services/role.service';
import { parseId, validateName, validateData } from '../utils/validators';
import type { RoleID, RoleName } from '../types/role.interface';

class RoleController {
  constructor() {
    // Привязка методов к контексту класса
    this.getAllRole = this.getAllRole.bind(this);
    this.getOneRole = this.getOneRole.bind(this);
    this.createRole = this.createRole.bind(this);
    this.updateRole = this.updateRole.bind(this);
    this.deleteRole = this.deleteRole.bind(this);
  }

  private readonly name = 'Роли';

  async getOneRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      const role = await RoleService.getOneRole(id as RoleID | RoleName);
      res.status(200).json(role);
    } catch (error: unknown) {
      next(error);
    }
  }

  async getAllRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await RoleService.getAllRoles();
      res.status(200).json(roles);
    } catch (error: unknown) {
      next(error);
    }
  }

  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = validateName(req.body, this.name);
      const role = await RoleService.createRole({
        value: name as RoleName,
        description: '',
      });
      res.status(201).json(role);
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      validateData(req.body, this.name);
      const role = await RoleService.updateRole(id, req.body);
      res.status(200).json(role);
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      const role = await RoleService.deleteRole(id);
      res.status(200).json(role);
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new RoleController();
