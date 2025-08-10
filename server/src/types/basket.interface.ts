export interface BasketProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface BrandAttributes {
  id?: number;
  name: string;
}

export interface BasketResponse {
  id: number;
  products: BasketProduct[];
  userId?: number;
  total?: number;
}

export type BasketWithProducts = {
  id: number;
  userId: number;
  products?: Array<{
    id: number;
    name: string;
    price: number;
    BasketProduct: {
      quantity: number;
    };
  }>;
};
