// ^ хранилище корзины
import { makeAutoObservable } from "mobx";

class OrderStore {
  _orders: any[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get orders() {
    return this._orders;
  }

  set orders(orders) {
    this._orders = orders;
  }

  // Всего позиций в Корзине
  get count() {
    return this._orders.length;
  }

  // стоимость всех Продуктов в Корзины
  get sum() {
    return this._orders.reduce(
      (sum, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
  }
}

export default OrderStore;
