// ^ хранилище Заказов и их Позиция

import { makeAutoObservable, runInAction } from "mobx";

import { orderAPI } from "@/api/catalog/orderAPI";
import { productAPI } from "@/api/catalog/productAPI";
import type { OrderData } from "@/types/api/shopping.types";

class OrderStore {
  orders: OrderData[] = [];
  currentOrder: OrderData | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // LOCALSTORE ----------------------------------------------------------------------------------

  /**
   * Загрузка списка заказов пользователя
   */
  async loadOrders() {
    this.isLoading = true;
    try {
      const orders = await orderAPI.getUserOrders();
      runInAction(() => {
        this.orders = orders;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Не удалось загрузить заказы";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * Загрузка деталей конкретного заказа
   */
  async loadOrderDetails(id: number) {
    this.isLoading = true;
    try {
      const order = await orderAPI.getOrderById(id);
      runInAction(() => {
        this.currentOrder = order;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Не удалось загрузить детали заказа";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * Создание нового заказа
   */
  async createOrder(orderData: OrderData) {
    this.isLoading = true;
    try {
      const newOrder = await orderAPI.createOrder(orderData);
      runInAction(() => {
        this.orders.unshift(newOrder);
        this.error = null;
      });
      return newOrder;
    } catch (error) {
      runInAction(() => {
        this.error = "Не удалось создать заказ";
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
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
