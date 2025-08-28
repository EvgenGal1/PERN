// ^ хранилище Заказов и их Позиция

import { action, makeAutoObservable, observable, runInAction, spy } from "mobx";

import { orderAPI } from "@/api/shopping/orderAPI";
import type { OrderData } from "@/types/shopping.types";
import { errorHandler } from "@/utils/errorHandler";
import { MEGA_DEBUG } from "@/utils/constDebug";
import { log, logErr } from "@/utils/logger";

class OrderStore {
  @observable orders: OrderData[] = [];
  @observable currentOrder: OrderData | null = null;
  @observable isLoading = false;

  constructor() {
    makeAutoObservable(this);
    MEGA_DEBUG &&
      process.env.NODE_ENV === "development" &&
      spy((event) => {
        if (event.type === "action" && event.object === this) {
          log(`%cOrderStore: ${event.name}`, "color: #4caf50;");
        }
      });
  }

  // LOCALSTORE ----------------------------------------------------------------------------------

  /**
   * Загрузка списка заказов пользователя
   */
  @action async loadOrders() {
    this.isLoading = true;
    try {
      const orders = await orderAPI.getAllOrdersUser();
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
      // const order = await orderAPI.getOrderById(id);
      // runInAction(() => {
      //   this.currentOrder = order;
      // });
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
      const newOrder = await orderAPI.createOrderUser(orderData);
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
    // обраб. ч/з универ.fn обраб.ошб.
    const apiError = errorHandler(error, `UserStore: ${context}`);
    // логг.
    logErr(`Ошб.в UserStore [${context}]`, apiError);
    // отправка ошб.в Sentry
    // captureException(apiError);
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
  // get sum() {
  //   return this.orders.reduce(
  //     (sum, item: { price: number; quantity: number }) =>
  //       sum + item.price * item.quantity,
  //     0
  //   );
  // }

  // СЕТТЕРЫ ----------------------------------------------------------------------------------

  set setOrders(orders) {
    this.orders = orders;
  }
}

export default OrderStore;
