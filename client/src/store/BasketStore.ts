// ^ хранилище Корзины

import { action, makeAutoObservable, observable, runInAction, spy } from "mobx";

import { basketAPI } from "@/api/shopping/basketAPI";
import type { BasketData, BasketProduct } from "@/types/api/shopping.types";

class BasketStore {
  @observable products: BasketProduct[] = [];
  @observable total: number = 0;
  @observable isLoading = false;
  @observable error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: false, deep: false });
    spy((event) => {
      if (event.type === "action")
        console.log("BasketStore Action:", event.name);
    });
    this.loadFromLocalStorage();
  }

  // LOCALSTORE ----------------------------------------------------------------------------------

  // загр.данн.из LS
  @action private loadFromLocalStorage() {
    const storedData = localStorage.getItem("basketStore");
    if (storedData) {
      try {
        const { items } = JSON.parse(storedData) as { items: BasketProduct[] };
        this.products = items || [];
        this.calculateTotals();
      } catch (error) {
        console.error("Ошибка Загрузки basketStore из LS :", error);
        this.clearLocalStorage();
      }
    }
  }

  // сохр.данн.в LS
  @action saveToLocalStorage() {
    localStorage.setItem(
      "basketStore",
      JSON.stringify({ items: this.products })
    );
  }

  // удал.данн.из LS
  @action clearLocalStorage() {
    localStorage.removeItem("basketStore");
  }

  // ASYNC ----------------------------------------------------------------------------------

  // получить Корзину
  @action async fetchBasket(): Promise<void> {
    if (this.isLoading || this.products.length > 0) return;
    this.isLoading = true;
    this.error = null;
    try {
      const basket = await basketAPI.getOneBasket();
      this.updateBasket(basket);
    } catch (error) {
      this.handleError("Ошибка Загрузки Корзины:", error);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  // добавить Продукт в Корзину
  @action async fetchAddProduct(productId: number): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;
    this.error = null;
    try {
      const basket = await basketAPI.appendBasket(productId);
      this.updateBasket(basket);
    } catch (error) {
      this.handleError("Ошибка Добавления Продукта в Корзину:", error);
      throw error;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  @action async fetchRemoveProduct(productId: number): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;
    this.error = null;
    try {
      const data = await basketAPI.removeBasket(productId);
      this.updateBasket(data);
    } catch (error) {
      this.handleError("Ошибка Удаления Продуктов из Корзины:", error);
      throw error;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  @action async incrementProduct(productId: number): Promise<void> {
    await this.fetchUpdateProductQuantity(productId, "increment");
  }

  @action async decrementProduct(productId: number): Promise<void> {
    await this.fetchUpdateProductQuantity(productId, "decrement");
  }

  // ДОП.МТД. (PRIVATE HELPERS/UPD ПРОДУКТЫ/КАЛЬКУЛЯЦИЯ/ОШИБКИ) ----------------------------------------------------------------------------------

  // Получить Обновление Количества Продукта
  private async fetchUpdateProductQuantity(
    productId: number,
    action: "increment" | "decrement"
  ): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;
    this.error = null;
    try {
      const apiMethod =
        action === "increment"
          ? basketAPI.incrementBasket
          : basketAPI.decrementBasket;
      const data = await apiMethod(productId);
      this.updateBasket(data);
    } catch (error) {
      this.handleError(`Ошибка ${action} Продукта:`, error);
      throw error;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  @action private updateBasket(basket?: BasketData) {
    if (!basket) return;
    runInAction(() => {
      this.products = Array.isArray(basket.products) ? basket.products : [];
      this.total = basket.total !== 0 ? basket.total : this.calculateTotals();
      this.saveToLocalStorage();
    });
  }

  // вроде не нужно. подсчёт в БД
  @action private calculateTotals(): number {
    return (this.total = this.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ));
  }

  @action private handleError(message: string, error: unknown) {
    console.error(message, error);
    runInAction(() => {
      this.error = error instanceof Error ? error.message : "Unknown error";
    });
  }

  // ==================== Getters ====================

  // Всего Позиций в Корзине (есть total)
  get count(): number {
    return this.products.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Cтоимость Всех Продуктов Корзины
  get sum(): number {
    return this.products.reduce(
      (sum, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
  }

  // ==================== UI Actions ====================
  @action clearBasket(): void {
    this.products = [];
    this.total = 0;
    this.error = null;
    this.saveToLocalStorage();
  }
}

export default BasketStore;
