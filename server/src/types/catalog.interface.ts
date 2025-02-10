// Сущности Каталога
export interface CategoryData {
  id?: number;
  name: string;
}
export interface BrandData {
  id?: number;
  name: string;
}

// Рейтинг
export interface RatingData {
  rates: number; // ставки
  votes: number; // голоса
  rating: number; // рейтинг
}
