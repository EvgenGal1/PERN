import ProductModel from '../models/ProductModel';
import ProductPropModel from '../models/ProductPropModel';

export interface ProductCreateDTO {
  name: string;
  price: number;
  categoryId?: number | null;
  brandId?: number | null;
  props?: string;
}

export interface ProductUpdateDTO {
  name?: string;
  price?: number;
  rating?: number;
  categoryId?: number;
  brandId?: number;
  image?: string | null;
  props?: string;
}

export interface ProductAttributes extends Omit<ProductModel, 'props'> {
  props?: ProductPropModel[];
}

export interface ProductOptions {
  categoryId?: string;
  brandId?: string;
  limit?: number;
  page?: number;
  sortOrd?: 'ASC' | 'DESC';
  sortField?: string;
}

export interface ProductPropAttributes {
  id?: number;
  name: string;
  value: string;
  productId: number;
}
