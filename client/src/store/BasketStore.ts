// ^ хранилище Корзины

import { action, makeAutoObservable, observable, runInAction } from "mobx";

import { basketAPI } from "@/api/shopping/basketAPI";
import { BasketProduct } from "@/types/api/shopping.types";

class BasketStore {
  @observable products: BasketProduct[] = [];
  @observable total: number = 0;
  @observable isLoading = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: false, deep: false });

    // чтение данн.из localStorage при инициализации
    const storedData = localStorage.getItem("basketStore");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.products = parsedData.items || [];
    }
  }

  // сохр.данн.в LS
  @action saveToLocalStorage() {
    localStorage.setItem(
      "basketStore",
      JSON.stringify({
        items: this.products,
      })
    );
  }

  // удал.данн.из LS
  @action clearLocalStorage() {
    localStorage.removeItem("basketStore");
  }

  // получить Корзину
  async fetchBasket(): Promise<void> {
    if (this.isLoading || this.products.length > 0) return;
    this.isLoading = true;
    try {
      const data = await basketAPI.getOneBasket();
      runInAction(() => {
        this.products = Array.isArray(data) ? data.products : [];
        this.total = Array.isArray(data) ? data.total : 0;
      });
    } catch (error) {
      console.error("Ошибка загрузки Брендов:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // добавить Протукт в Корзину
  async addProduct(productId: number): Promise<void> {
    if (this.isLoading || this.products.length) this.isLoading = true;
    this.isLoading = true;
    try {
      const data = await basketAPI.appendBasket(productId);
      runInAction(() => {
        this.products = Array.isArray(data) ? data.products : [];
        this.total = Array.isArray(data) ? data.total : 0;
      });
      this.saveToLocalStorage();
    } catch (error) {
      console.error("Ошибка Добавления в Корзину:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // Всего Позиций в Корзине (есть total)
  get count() {
    return this.products.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Cтоимость Всех Продуктов Корзины
  get sum() {
    return this.products.reduce(
      (sum, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
  }

  // проверка наличия Продукта в Корзине
  isProductInBasket(productId: number): boolean {
    return this.products.some((product) => product.id === productId);
  }
}

export default BasketStore;
