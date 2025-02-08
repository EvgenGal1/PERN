// Корзина и её Продукты
export interface BasketProduct {
  id?: number;
  name: string;
  price: number;
  quantity: number;
}

export interface BasketData {
  id?: number;
  products: BasketProduct[];
  userId?: number;
  total?: number;
}
