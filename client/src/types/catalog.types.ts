// типы Каталога Магазина и его сущностей

// переменные CatalogStore
export type CatalogStoreData = {
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
};

// Сущности Каталога
export type CategoryData = {
  id: number;
  name: string;
};

export type BrandData = {
  id: number;
  name: string;
};

// Продукт и их Свойства
export type ProductData = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image?: string;
  category: CategoryData;
  brand: BrandData;
  ratings?: RatingData;
  props?: PropertyData[];
};

export type PropertyData = {
  name: string;
  value: string;
};

export type ProductRes = {
  rows: ProductData[];
  pagination: { count: number; limit: number; page: number };
};

// Рейтинг
export type RatingData = {
  rates: number; // ставки
  votes: number; // голоса
  rating: number; // рейтинг
};
