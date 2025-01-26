// ^ controller Свойств Продукта

import { Request, Response, NextFunction } from 'express';

import ProductPropService from '../services/productProp.service';
import { parseId, validateData } from '../utils/validators';

class ProductPropController {
  constructor() {
    this.getAllProdProp = this.getAllProdProp.bind(this);
    this.getOneProdProp = this.getOneProdProp.bind(this);
    this.createProdProp = this.createProdProp.bind(this);
    this.updateProdProp = this.updateProdProp.bind(this);
    this.deleteProdProp = this.deleteProdProp.bind(this);
  }

  private readonly name = 'Продукта';
  private readonly prop = 'Свойств Продукта';

  async getOneProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseId(req.params.productId, this.name);
      const propId = parseId(req.params.id, this.prop);
      const property = await ProductPropService.getOneProdProp(
        productId,
        propId,
      );
      res.status(200).json(property);
    } catch (error: unknown) {
      next(error);
    }
  }

  async getAllProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseId(req.params.productId, this.name);
      const properties = await ProductPropService.getAllProdProp(productId);
      res.status(200).json(properties);
    } catch (error: unknown) {
      next(error);
    }
  }

  async createProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseId(req.params.productId, this.name);
      validateData(req.body, this.prop);
      const property = await ProductPropService.createProdProp(
        productId,
        req.body,
      );
      res.status(201).json(property);
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseId(req.params.productId, this.name);
      const propId = parseId(req.params.id, this.prop);
      validateData(req.body, this.prop);
      const property = await ProductPropService.updateProdProp(
        productId,
        propId,
        req.body,
      );
      res.status(200).json(property);
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteProdProp(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseId(req.params.productId, this.name);
      const propId = parseId(req.params.id, this.prop);
      const property = await ProductPropService.deleteProdProp(
        productId,
        propId,
      );
      res.status(204).json({
        message: 'Свойство успешно удалено',
        data: property,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new ProductPropController();
