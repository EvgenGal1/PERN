// ^ controller для свойств товара
import { Request, Response, NextFunction } from 'express';

import AppError from '../middleware/errors/ApiError';
import ProductPropService from '../services/productProp.service';

class ProductPropController {
  async getAllProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error('Не указан id товара');
      }
      const properties = await ProductPropService.getAllProdProp(
        +req.params.productId,
      );
      res.json(properties);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async getOneProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error('Не указан id товара');
      }
      if (!req.params.id) {
        throw new Error('Не указано id свойства');
      }
      const property = await ProductPropService.getOneProdProp(
        +req.params.productId,
        +req.params.id,
      );
      res.json(property);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async createProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error('Не указан id товара');
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для создания');
      }
      const property = await ProductPropService.createProdProp(
        +req.params.productId,
        req.body,
      );
      res.json(property);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async updateProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error('Не указан id товара');
      }
      if (!req.params.id) {
        throw new Error('Не указано id свойства');
      }
      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для обновления');
      }
      const property = await ProductPropService.updateProdProp(
        +req.params.productId,
        +req.params.id,
        req.body,
      );
      res.json(property);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }

  async deleteProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.productId) {
        throw new Error('Не указан id товара');
      }
      if (!req.params.id) {
        throw new Error('Не указано id свойства');
      }
      const property = await ProductPropService.deleteProdProp(
        +req.params.productId,
        req.params.id,
      );
      res.json(property);
    } catch (error: unknown) {
      next(
        AppError.badRequest(
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        ),
      );
    }
  }
}

export default new ProductPropController();
