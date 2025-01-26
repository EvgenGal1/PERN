export interface BasketProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface BasketResponse {
  id: number;
  products: BasketProduct[];
  userId?: number;
  total?: number;
}
