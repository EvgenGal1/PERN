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

  // всего позиций в корзине
  get count() {
    return this._orders.length;
  }

  // стоимость всех товаров корзины
  get sum() {
    return this._orders.reduce(
      (sum, item: any) => sum + item.price * item.quantity,
      0
    );
  }

  set orders(orders) {
    this._orders = orders;
  }
}

export default OrderStore;
