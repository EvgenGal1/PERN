// Сущности Каталога
export interface CategoryData {
  id: number;
  name: string;
}

export interface BrandData {
  id: number;
  name: string;
}

// Продукт и их Свойства
export interface ProductData {
  id?: number;
  name: string;
  price: number;
  rating: number;
  image?: string;
  category?: CategoryData;
  brand?: BrandData;
  ratings?: RatingData;
  properties?: PropertyData[];
}

export interface PropertyData {
  id?: number;
  name: string;
  value: string;
}

export interface ProductRes {
  count: number;
  limit: number;
  rows: ProductData[];
}

// Рейтинг
export interface RatingData {
  rates: number; // ставки
  votes: number; // голоса
  rating: number; // рейтинг
}
