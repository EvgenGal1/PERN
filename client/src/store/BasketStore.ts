// ^ хранилище Корзины

import { action, makeAutoObservable, observable, runInAction, spy } from "mobx";
import { debounce } from "lodash";

import { basketAPI } from "@/api/shopping/basketAPI";
import type { BasketData, BasketProduct } from "@/types/shopping.types";
import { ApiError } from "@/utils/errorAPI";
import { errorHandler } from "@/utils/errorHandler";

class BasketStore {
  @observable products: BasketProduct[] = [];
  @observable total: number = 0;
  @observable isLoading = false;
  @observable error: ApiError | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: false, deep: false });
    process.env.NODE_ENV === "development" &&
      spy((event) => {
        if (event.type === "action" && event.object === this) {
          console.log(`%cBasketStore: ${event.name}`, "color: #0070cc;");
        }
      });
    this.loadFromLocalStorage();
  }

  // LOCALSTORE ----------------------------------------------------------------------------------

  // загр.данн.из LS
  @action private loadFromLocalStorage() {
    const storedData = localStorage.getItem("basketStore");
    if (!storedData) return;
    try {
      const { products } = JSON.parse(storedData) as {
        products: BasketProduct[];
      };
      this.products = products || [];
      this.calculateTotals();
    } catch (error) {
      this.handleError(error, "Ошибка Загрузки basketStore из LS");
      this.clearLocalStorage();
    }
  }

  // сохр.данн.в LS
  @action private saveToLocalStorage = debounce(() => {
    try {
      localStorage.setItem(
        "basketStore",
        JSON.stringify({ products: this.products })
      );
    } catch (error) {
      this.handleError(error, `Ошибка Сохранения basketStore из LS`);
    }
  }, 500);

  // удал.данн.из LS
  @action clearLocalStorage() {
    localStorage.removeItem("basketStore");
  }

  // ASYNC ----------------------------------------------------------------------------------

  // получить Корзину
  @action async loadBasket(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;
    this.error = null;
    try {
      const basket = await basketAPI.getOneBasket();
      runInAction(() => this.updateBasket(basket));
    } catch (error) {
      this.handleError(error, "Ошибка Загрузки Корзины");
      this.loadFromLocalStorage();
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  // добавить Продукт в Корзину
  @action async addProduct(productId: number): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;
    this.error = null;
    try {
      const basket = await basketAPI.appendBasket(productId);
      runInAction(() => this.updateBasket(basket));
    } catch (error) {
      this.handleError(error, "Ошибка Добавления Продукта в Корзину");
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  @action async incrementProduct(productId: number): Promise<void> {
    await this.updateProductQuantity(productId, "increment");
  }

  @action async decrementProduct(productId: number): Promise<void> {
    await this.updateProductQuantity(productId, "decrement");
  }

  // общ.мтд.чтоб обновить Количества Продукта
  @action async updateProductQuantity(
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
      this.handleError(error, `Ошибка ${action} Кол-ва Продукта`);
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
      this.handleError(error, "Ошибка Удаления Продуктов из Корзины");
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  // ДОП.МТД. (PRIVATE HELPERS/UPD ПРОДУКТЫ/КАЛЬКУЛЯЦИЯ/ОШИБКИ) ----------------------------------------------------------------------------------

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

  @action private handleError(error: unknown, context?: string) {
    // обраб. ч/з универ.fn обраб.ошб.
    const apiError = errorHandler(error, `UserStore: ${context}`);
    // сохр./логг.
    this.error = apiError;
    console.error(`Ошб.в UserStore [${context}]`, apiError);
    // отправка ошб.в Sentry
    // captureException(apiError);
  }

  // ==================== ГЕТТЕРЫ ====================

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

  get isEmpty(): boolean {
    return this.products.length === 0;
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
