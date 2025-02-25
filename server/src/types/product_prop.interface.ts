import { BrandData, CategoryData, RatingData } from './catalog.interface';

// Продукт и их Свойства
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

export interface ProductData {
  id?: number | null;
  name: string;
  price: number;
  rating?: RatingData | null;
  image?: string | null;
  category?: CategoryData | null;
  brand?: BrandData | null;
  ratings?: RatingData | null;
  properties?: PropertyData[] | [];
}

export interface ProductOptions {
  categoryId?: string;
  brandId?: string;
  limit?: number;
  page?: number;
  order?: 'ASC' | 'DESC';
  field?: string;
}

export interface ProductPropAttributes {
  id?: number;
  name: string;
  value: string;
  productId: number;
}

export interface PropertyData {
  id?: number;
  name: string;
  value: string;
}
