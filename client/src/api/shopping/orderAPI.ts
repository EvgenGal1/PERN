import { OrderData, OrderItemData } from "@/types/shopping.types";
import { authInstance, guestInstance } from "../axiosInstances";
import { handleRequest } from "../handleRequest";

export const orderAPI = {
  /*
   * ЗАКАЗ
   */

  /**
   * Создание нового Заказа
   */
  async createOrderAdmin(body: OrderData): Promise<OrderData> {
    return handleRequest(
      () => authInstance.post<OrderData>("orders/create/admin", body),
      "Order/Create"
    );
  },

  /**
   * Получение Одного Заказа по ID
   */
  async getOneOrder(orderId: number): Promise<OrderData> {
    return handleRequest(
      () => authInstance.get<OrderData>(`orders/getone/${orderId}/admin`),
      "Order/GetOne"
    );
  },

  /**
   * Получение списка Всех Заказов
   */
  async getAllOrdersAdmin(): Promise<OrderData[]> {
    return handleRequest(
      () => authInstance.get<OrderData[]>("orders/getall/admin"),
      "Order/Admin/GetAll"
    ).catch((error) => {
      if (error.status === 404) return [];
      throw error;
    });
  },

  /**
   * Обновление Заказа по ID
   */
  async updateOrder(orderId: number, body: OrderData): Promise<OrderData> {
    return handleRequest(
      () => authInstance.put<OrderData>(`orders/update/${orderId}/admin`, body),
      "Order/Update"
    );
  },

  /**
   * Удаление Заказа по ID
   */
  async deleteOrder(orderId: number): Promise<void> {
    return handleRequest(
      () => authInstance.delete(`orders/delete/${orderId}/admin`),
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
    console.log("body : ", body);
    return handleRequest(
      () => authInstance.post<OrderData>("orders/create/user", body),
      "Order/UserCreate"
    );
  },

  /**
   * Получение списка Всех Заказов Пользователя
   */
  async getAllOrdersUser(): Promise<OrderData[]> {
    return handleRequest(
      () => authInstance.get<OrderData[]>("orders/getall/user"),
      "Order/User/GetAll"
    ).catch((error) => {
      if (error.status === 404) return [];
      throw error;
    });
  },

  /**
   * Получение Одного Заказа Пользователя
   */
  async getOneOrderUser(orderId: number): Promise<OrderData> {
    return handleRequest(
      () => authInstance.get<OrderData>(`orders/getone/${orderId}/user`),
      "Order/UserGetOne"
    );
  },

  /**
   * Создание нового заказа из Корзины
   */
  async createOrderGuest(body: OrderData): Promise<OrderData> {
    return handleRequest(
      () => guestInstance.post<OrderData>("orders/create/guest", body),
      "Order/GuestCreate"
    );
  },
};
