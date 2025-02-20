import { Request, Response, NextFunction } from 'express';

import ProductService from '../services/product.service';
import { parseId, validateData, parseQueryParam } from '../utils/validators';

class ProductController {
  constructor() {
    this.getOneProduct = this.getOneProduct.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
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

  async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { categoryId, brandId } = req.params;
      const { limit, page, order, field } = req.query;
      const options = {
        categoryId: categoryId ? String(categoryId) : undefined,
        brandId: brandId ? String(brandId) : undefined,
        limit: parseQueryParam(limit, 20, 'limit'),
        page: parseQueryParam(page, 1, 'page'),
        order:
          order === 'ASC' || order === 'DESC'
            ? (order as 'ASC' | 'DESC')
            : undefined,
        field: field ? String(field) : undefined,
      };
      const products = await ProductService.getAllProducts(options);

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
      // присвойка типов
      const imageFile = req.files?.image as Express.Multer.File | undefined;
      const product = await ProductService.createProduct(
        req.body,
        // обраб.е/и масс.ф.
        Array.isArray(imageFile) ? imageFile[0] : imageFile,
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
      // присвойка типов
      const imageFile = req.files?.image as Express.Multer.File | undefined;
      const product = await ProductService.updateProduct(
        id,
        req.body,
        // обраб.е/и масс.ф.
        Array.isArray(imageFile) ? imageFile[0] : imageFile,
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
