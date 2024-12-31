// ^ хранилище корзины
import { makeAutoObservable } from "mobx";

class BasketStore {
  _products = [];

  constructor() {
    makeAutoObservable(this);
  }

  get products() {
    return this._products;
  }

  set products(products) {
    this._products = products;
  }

  // всего позиций в корзине
  get count() {
    return this._products.length;
  }

  // стоимость всех товаров корзины
  get sum() {
    return this._products.reduce(
      (sum, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
  }
}

export default BasketStore;
