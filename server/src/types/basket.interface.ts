import BasketModel from '../models/BasketModel';
import BasketProductModel from '../models/BasketProductModel';
import ProductModel from '../models/ProductModel';

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

export type BasketWithProducts = BasketModel & {
  products?: (ProductModel & {
    BasketProduct: BasketProductModel;
  })[];
};
