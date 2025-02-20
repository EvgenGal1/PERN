import {
  ProductData,
  ProductRes,
  PropertyData,
} from "@/types/api/catalog.types";
import { handleRequest } from "../handleRequest";
import { authInstance, guestInstance } from "../axiosInstances";

// CRUD > Продукта и его Свойств
export const productAPI = {
  /*
   * ПРОДУКТ
   */

  /**
   * Создание Нового Продукта
   * @param product - Данные Нового Продукта
   */
  async createProduct(product: ProductData): Promise<ProductData> {
    return handleRequest(
      () => authInstance.post<ProductData>("products/create", product),
      "Products/Create"
    );
  },

  /**
   * Получение Одного Продукта по ID
   * @param id - ID Продукта
   */
  async getOneProduct(id: number): Promise<ProductData> {
    return handleRequest(
      () => guestInstance.get<ProductData>(`products/getone/${id}`),
      "Products/GetOne"
    );
  },

  /**
   * Получение Всех Продктов
   * @param categoryId - ID Категории (необязательно)
   * @param brandId - ID Бренда (необязательно)
   * @param page - Номер Страницы
   * @param limit - Лимит Продктов на страницу
   * @param order - Порядок Сортировки ("ASC" или "DESC")
   * @param field - Поле Сортировки ("name", "price", "rating")
   */
  async getAllProducts(
    categoryId?: string | null,
    brandId?: string | null,
    page: number = 1,
    limit: number = 10,
    order?: string,
    field?: string
  ): Promise<ProductRes> {
    // параметры для постраничной навигации
    const params: any = { page, limit };
    // сортировка по порядку и полю (назв.,цена,рейтинг)
    if (order) params.order = order;
    if (field) params.field = field;
    // базовый URL получ.всех Продуктов
    let url = "products/getall";
    // дополнение URL парам.из props (для 1го знач. и мн.знач.ч/з разделитель(_))
    if (categoryId) url += `/categoryId/${categoryId}`;
    if (brandId) url += `/brandId/${brandId}`;
    // req/res
    return handleRequest(
      () => guestInstance.get<ProductRes>(url, { params }),
      "Products/GetAll"
    );
  },

  /**
   * Обновление Продукта
   * @param id - ID Продукта
   * @param product - Обновляемые данные Продукта
   */
  async updateProduct(id: number, product: ProductData): Promise<ProductData> {
    return handleRequest(
      () => authInstance.put<ProductData>(`products/update/${id}`, product),
      "Products/Update"
    );
  },

  /**
   * Удаление Продукта
   * @param id - ID Продукта
   */
  async deleteProduct(id: number): Promise<void> {
    return handleRequest(
      () => authInstance.delete(`products/delete/${id}`),
      "Products/Delete"
    );
  },

  /*
   * СВОЙСТВА ПРОДУКТА
   */

  /**
   * Создание Свойства Продукта
   * @param productId - ID Продукта
   * @param property - Данные Свойства
   */
  async createProperty(
    productId: number,
    property: PropertyData
  ): Promise<PropertyData> {
    return handleRequest(
      () =>
        authInstance.post<PropertyData>(
          `products/${productId}/property/create`,
          property
        ),
      "Properties/Create"
    );
  },

  /**
   * Обновление Свойства Продукта
   * @param productId - ID Продукта
   * @param id - ID Свойства
   * @param property - Новые данные Свойства
   */
  async updateProperty(
    productId: number,
    id: number,
    property: PropertyData
  ): Promise<PropertyData> {
    return handleRequest(
      () =>
        authInstance.put<PropertyData>(
          `products/${productId}/property/update/${id}`,
          property
        ),
      "Properties/Update"
    );
  },

  /**
   * Удаление Свойства Продукта
   * @param productId - ID Продукта
   * @param id - ID Свойства
   */
  async deleteProperty(productId: number, id: number): Promise<void> {
    return handleRequest(
      () => authInstance.delete(`products/${productId}/property/delete/${id}`),
      "Properties/Delete"
    );
  },
};
