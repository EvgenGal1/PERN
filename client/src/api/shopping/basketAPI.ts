import { BasketData } from "../../types/api/shopping.types";
import { handleRequest } from "../handleRequest";
import { guestInstance } from "../axiosInstances";

export const basketAPI = {
  /**
   * Получение Корзины из cookies
   */
  async getOneBasket(): Promise<BasketData> {
    return handleRequest(
      () => guestInstance.get<BasketData>("baskets/getone"),
      "Basket/FetchBasket"
    );
  },

  /**
   * Добавление Продукта в Корзину
   */
  async appendBasket(productId: number): Promise<BasketData> {
    return handleRequest(
      () =>
        guestInstance.put<BasketData>(`baskets/product/${productId}/append/1`),
      "Basket/AppendBasket"
    );
  },

  /**
   * Увеличение Количества Продукта в Корзине
   */
  async incrementBasket(productId: number): Promise<BasketData> {
    return handleRequest(
      () =>
        guestInstance.put<BasketData>(
          `baskets/product/${productId}/increment/1`
        ),
      "Basket/IncrementBasket"
    );
  },

  /**
   * Уменьшение Количества Продукта в Корзине
   */
  async decrementBasket(productId: number): Promise<BasketData> {
    return handleRequest(
      () =>
        guestInstance.put<BasketData>(
          `baskets/product/${productId}/decrement/1`
        ),
      "Basket/DecrementBasket"
    );
  },

  /**
   * Удаление Продукта из Корзины
   */
  async removeBasket(productId: number): Promise<any> {
    return handleRequest(
      () => guestInstance.put(`baskets/product/${productId}/remove`),
      "Basket/RemoveBasket"
    );
  },

  /**
   * Очистка Корзины
   */
  async clearBasket(): Promise<any> {
    return handleRequest(
      () => guestInstance.put(`baskets/clear`),
      "Basket/ClearBasket"
    );
  },

  /**
   * Создание нового заказа из Корзины
   */
  async guestCreate(body: {
    productId: number;
    quantity: number;
  }): Promise<any> {
    return handleRequest(
      () => guestInstance.post("orders/guest/create", body),
      "Basket/GuestCreate"
    );
  },
};

// Интерфейсы
