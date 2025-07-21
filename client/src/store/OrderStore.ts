// ^ хранилище Заказов и их Позиция

import { action, makeAutoObservable, observable, runInAction } from "mobx";

import { orderAPI } from "@/api/shopping/orderAPI";
import type { OrderData } from "@/types/api/shopping.types";
import { ApiError } from "@/utils/errorAPI";

class OrderStore {
  @observable orders: OrderData[] = [];
  @observable currentOrder: OrderData | null = null;
  @observable isLoading = false;
  @observable error: ApiError | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // LOCALSTORE ----------------------------------------------------------------------------------

  /**
   * Загрузка списка заказов пользователя
   */
  @action async loadOrders() {
    this.isLoading = true;
    try {
      const orders = await orderAPI.getUserOrders();
      runInAction(() => {
        this.orders = orders;
      });
    } catch (error) {
      this.handleError(error, "Не удалось Загрузить Заказы");
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * Загрузка деталей конкретного заказа
   */
  @action async loadOrderDetails(id: number) {
    this.isLoading = true;
    try {
      const order = await orderAPI.getOrderById(id);
      runInAction(() => {
        this.currentOrder = order;
      });
    } catch (error) {
      this.handleError(error, "Не удалось Загрузить Детали Заказы");
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * Создание нового заказа
   */
  @action async createOrder(orderData: OrderData) {
    this.isLoading = true;
    try {
      const newOrder = await orderAPI.createOrder(orderData);
      runInAction(() => {
        this.orders.unshift(newOrder);
      });
      return newOrder;
    } catch (error) {
      this.handleError(error, "Не удалось Создать Заказ");
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // ДОП.МТД. (ОШИБКИ) ----------------------------------------------------------------------------------

  @action private handleError(error: unknown, context?: string) {
    const apiError =
      error instanceof ApiError
        ? error
        : new ApiError(500, "Неизвестная ошибка", "UNKNOWN_ERROR", { context });
    this.error = apiError;
    // captureException(error); // Отправка ошибки в Sentry или аналоги
    console.error(`Ошб.в CatalogStore [${context}]`, apiError);
  }

  // ГЕТТЕРЫ ----------------------------------------------------------------------------------

  get getOrders() {
    return this.orders;
    // this.loadOrders();
  }

  // Всего позиций в Корзине
  get count() {
    return this.orders.length;
  }

  // стоимость всех Продуктов в Корзины
  get sum() {
    return this.orders.reduce(
      (sum, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
  }

  // СЕТТЕРЫ ----------------------------------------------------------------------------------

  set setOrders(orders) {
    this.orders = orders;
  }
}

export default OrderStore;
