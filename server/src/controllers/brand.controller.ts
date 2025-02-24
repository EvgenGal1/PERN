import { Request, Response, NextFunction } from 'express';
// import { createHash } from 'crypto';

import BrandService from '../services/brand.service';
import { parseId, validateName } from '../utils/validators';

// // генер. ETag для кэширования
// function generateETag(data: any): string {
//   const str = JSON.stringify(data);
//   return createHash('md5').update(str).digest('hex');
// }

class BrandController {
  constructor() {
    // привязка мтд.к контексту клс.
    this.getAllBrand = this.getAllBrand.bind(this);
    this.getOneBrand = this.getOneBrand.bind(this);
    this.createBrand = this.createBrand.bind(this);
    this.updateBrand = this.updateBrand.bind(this);
    this.deleteBrand = this.deleteBrand.bind(this);
  }

  private readonly name = 'Бренда';

  async getOneBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      const brand = await BrandService.getOneBrand(id);
      // // кэширование с использованием ETag
      // const etag = generateETag(brand);
      // // проверка совпадения ETag с заголовком If-None-Match
      // if (req.headers['if-none-match'] === etag) {
      //   console.log('Данные КЭШ не изменились');
      //   return res.status(304).end();
      // }
      res./* set('ETag', etag). */ status(200).json(brand);
    } catch (error: unknown) {
      next(error);
    }
  }

  async getAllBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await BrandService.getAllBrand();
      res.status(200).json(brands);
    } catch (error: unknown) {
      next(error);
    }
  }

  async createBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = validateName(req.body, this.name);
      const brand = await BrandService.createBrand({ name });
      res.status(201).json(brand);
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      const { name } = validateName(req.body, this.name);
      const brand = await BrandService.updateBrand(id, { name });
      res.status(200).json(brand);
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, this.name);
      await BrandService.deleteBrand(id);
      res.status(200).json({ message: 'Бренд успешно удален' });
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new BrandController();
