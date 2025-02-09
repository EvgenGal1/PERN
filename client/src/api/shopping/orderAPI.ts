import { OrderData, OrderItemData } from "../../types/api/shopping.types";
import { handleRequest } from "../handleRequest";
import { authInstance, guestInstance } from "../axiosInstances";

export const orderAPI = {
  /*
   * ЗАКАЗ
   */

  /**
   * Создание нового Заказа
   */
  async createOrder(body: OrderData): Promise<OrderData> {
    return handleRequest(
      () => authInstance.post<OrderData>("orders/create", body),
      "Order/Create"
    );
  },

  /**
   * Получение Одного Заказа по ID
   */
  async getOneOrder(orderId: number): Promise<OrderData> {
    return handleRequest(
      () => authInstance.get<OrderData>(`orders/getone/${orderId}`),
      "Order/GetOne"
    );
  },

  /**
   * Получение списка Всех Заказов
   */
  async getAllOrder(): Promise<OrderData[]> {
    return handleRequest(
      () => authInstance.get<OrderData[]>("orders/getall"),
      "Order/GetAll"
    );
  },

  /**
   * Обновление Заказа по ID
   */
  async updateOrder(orderId: number, body: OrderData): Promise<OrderData> {
    return handleRequest(
      () => authInstance.put<OrderData>(`orders/update/${orderId}`, body),
      "Order/Update"
    );
  },

  /**
   * Удаление Заказа по ID
   */
  async deleteOrder(orderId: number): Promise<void> {
    return handleRequest(
      () => authInstance.delete(`orders/delete/${orderId}`),
      "Order/Delete"
    );
  },

  /*
   * ПОЗИЦИИ ЗАКАЗА
   */

  /**
   * Создание Позиции Заказа
   */
  async createItem(orderId: number, item: OrderItemData): Promise<any> {
    return handleRequest(
      () => authInstance.post(`orders/${orderId}/item/create`, item),
      "Order/CreateItem"
    );
  },

  /**
   * Обновление Позиции Заказа
   */
  async updateItem(
    orderId: number,
    itemId: number,
    item: OrderItemData
  ): Promise<OrderItemData> {
    return handleRequest(
      () =>
        authInstance.put<OrderItemData>(
          `orders/${orderId}/item/update/${itemId}`,
          item
        ),
      "Order/UpdateItem"
    );
  },

  /**
   * Удаление Позиции Заказа
   */
  async deleteItem(orderId: number, itemId: number): Promise<void> {
    return handleRequest(
      () => authInstance.delete(`orders/${orderId}/item/delete/${itemId}`),
      "Order/DeleteItem"
    );
  },

  /*
   * ДОП.МТД.ЗАКАЗА (User,Guest)
   */

  /**
   * Создание Нового Заказа (Пользователь)
   */
  async createOrderUser(body: OrderData): Promise<OrderData> {
    return handleRequest(
      () => authInstance.post<OrderData>("orders/user/create", body),
      "Order/UserCreate"
    );
  },

  /**
   * Получение списка Всех Заказов Пользователя
   */
  async getAllOrderUser(): Promise<OrderData[]> {
    return handleRequest(
      () => authInstance.get<OrderData[]>("orders/user/getall"),
      "Order/UserGetAll"
    );
  },

  /**
   * Получение Одного Заказа Пользователя
   */
  async getOneOrderUser(orderId: number): Promise<OrderData> {
    return handleRequest(
      () => authInstance.get<OrderData>(`orders/user/getone/${orderId}`),
      "Order/UserGetOne"
    );
  },

  /**
   * Создание нового заказа из Корзины
   */
  async createOrderGuest(body: OrderData): Promise<OrderData> {
    return handleRequest(
      () => guestInstance.post<OrderData>("orders/guest/create", body),
      "Basket/GuestCreate"
    );
  },
};
