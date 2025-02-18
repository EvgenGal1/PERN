// ^ хранилище Корзины

import { makeAutoObservable } from "mobx";

class BasketStore {
  _products: any[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get products() {
    return this._products;
  }

  set products(products) {
    this._products = products;
  }

  // Всего Позиций в Корзине
  get count() {
    return this._products.length;
  }

  // стоимость Всех Продуктов Корзины
  get sum() {
    return this._products.reduce(
      (sum, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
  }
}

export default BasketStore;
