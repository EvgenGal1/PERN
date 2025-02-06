// Сущности каталога
export interface CategoryData {
  id: number;
  name: string;
}

// Товары и их Свойства
export interface ProductsData {
  id: number;
  name: string;
  price: number;
  rating: number;
  image?: string;
  category?: { name: string };
  brand?: { name: string };
  ratings?: RatingData;
  properties: Property[];
}

export interface Property {
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
