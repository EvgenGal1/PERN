// ^ хранилище корзины
import { makeAutoObservable } from "mobx";

class BasketStore {
  _products = [];

  constructor() {
    makeAutoObservable(this);
  }

  get products() {
    console.log("BasketStore Get prod 1 : " + 1);
    console.log("BasketStore Get_products : " + this._products);
    console.log(this._products);
    return this._products;
  }

  // всего позиций в корзине
  get count() {
    console.log("BasketStore count 1 : " + 1);
    return this._products.length;
  }

  // стоимость всех товаров корзины
  get sum() {
    console.log("BasketStore sum 1 : " + 1);
    return this._products.reduce(
      (sum, item: any) => sum + item.price * item.quantity,
      0
    );
  }

  set products(products) {
    console.log("BasketStore Set prod 1 : " + 1);
    console.log("BasketStore Set_products : " + this._products);
    console.log(this._products);
    this._products = products;
  }
}

export default BasketStore;
