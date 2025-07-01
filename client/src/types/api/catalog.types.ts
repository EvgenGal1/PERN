// переменные CatalogStore
export interface CatalogStoreData {
  categories: CategoryData[];
  brands: BrandData[];
  products: ProductData[];
  product: ProductData;
  filters: { category: string | null; brand: string | null };
  pagination: { page: number; limit: number; totalCount: number };
  sortSettings: {
    field: "name" | "price" | "rating" | "votes";
    order: "ASC" | "DESC";
  };
}

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
  id: number;
  name: string;
  price: number;
  rating: number;
  image?: string;
  category: CategoryData;
  brand: BrandData;
  ratings?: RatingData;
  props?: PropertyData[];
}

export interface PropertyData {
  name: string;
  value: string;
}

export interface ProductRes {
  rows: ProductData[];
  pagination: { count: number; limit: number; page: number };
}

// Рейтинг
export interface RatingData {
  rates: number; // ставки
  votes: number; // голоса
  rating: number; // рейтинг
}
