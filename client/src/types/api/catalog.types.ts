// Сущности каталога
export interface CategoryData {
  id: number;
  name: string;
}

export interface BrandData {
  id: number;
  name: string;
}

// Товары и их Свойства
export interface ProductsData {
  id?: number;
  name: string;
  price: number;
  rating?: number;
  image?: string;
  category?: CategoryData;
  brand?: BrandData;
  ratings?: RatingData;
  properties: PropertyData[];
}

export interface PropertyData {
  id: number;
  name: string;
  value: string;
}

export interface ProductRes {
  count: number;
  limit: number;
  rows: ProductsData[];
}

// Рейтинг
export interface RatingData {
  rates: number; // ставки
  votes: number; // голоса
  rating: number; // рейтинг
  ratingAll?: number;
}
