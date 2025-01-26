import { Request, Response, NextFunction } from 'express';

import ProductService from '../services/product.service';
import { parseId, validateData, parseQueryParam } from '../utils/validators';

class ProductController {
  constructor() {
    this.getAllProduct = this.getAllProduct.bind(this);
    this.getOneProduct = this.getOneProduct.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  private readonly name = 'Продукта';

  async getOneProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = parseId(req.params.id, this.name);
      const product = await ProductService.getOneProduct(id);
      res.status(200).json(product);
    } catch (error: unknown) {
      next(error);
    }
  }

  async getAllProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { categoryId, brandId } = req.params;
      const { limit, page, sortOrd, sortField } = req.query;
      const options = {
        categoryId: categoryId ? Number(categoryId) : null,
        brandId: brandId ? Number(brandId) : null,
        limit: parseQueryParam(limit, 20, 'limit'),
        page: parseQueryParam(page, 1, 'page'),
        sortOrd: sortOrd === 'ASC' || sortOrd === 'DESC' ? sortOrd : 'ASC',
        sortField: sortField || null,
      };
      const products = await ProductService.getAllProduct(options);

      res.status(200).json(products);
    } catch (error: unknown) {
      next(error);
    }
  }

  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      validateData(req.body, this.name);
      const product = await ProductService.createProduct(
        req.body,
        req.files?.image,
      );
      res.status(201).json(product);
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = parseId(req.params.id, this.name);
      validateData(req.body, this.name);
      const product = await ProductService.updateProduct(
        id,
        req.body,
        req.files?.image,
      );
      res.status(200).json(product);
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = parseId(req.params.id, this.name);
      const product = await ProductService.deleteProduct(id);
      res.status(204).json({
        message: 'Продукт успешно удален',
        data: product,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new ProductController();
