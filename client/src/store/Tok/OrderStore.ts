// ^ хранилище корзины
import { makeAutoObservable } from "mobx";

class OrderStore {
  _orders = [];

  constructor() {
    makeAutoObservable(this);
  }

  get orders() {
    return this._orders;
  }

  set orders(orders) {
    this._orders = orders;
  }

  // всего позиций в корзине
  get count() {
    return this._orders.length;
  }

  // стоимость всех товаров корзины
  get sum() {
    return this._orders.reduce(
      (sum, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
  }
}

export default OrderStore;
