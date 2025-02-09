import { ProductsData, PropertyData } from "../../types/api/catalog.types";
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
  async createProduct(product: ProductsData): Promise<ProductsData> {
    return handleRequest(
      () => authInstance.post<ProductsData>("products/create", product),
      "Products/Create"
    );
  },

  /**
   * Получение Одного Продукта по ID
   * @param id - ID Продукта
   */
  async getOneProduct(id: number): Promise<ProductsData> {
    return handleRequest(
      () => guestInstance.get<ProductsData>(`products/getone/${id}`),
      "Products/GetOne"
    );
  },

  /**
   * Получение Всех Продктов
   * @param categoryId - ID Категории (необязательно)
   * @param brandId - ID Бренда (необязательно)
   * @param page - Номер Страницы
   * @param limit - Лимит Продктов на страницу
   * @param sortOrd - Порядок Сортировки ("ASC" или "DESC")
   * @param sortField - Поле Сортировки ("name", "price", "rating")
   */
  async getAllProducts(
    categoryId?: string,
    brandId?: string,
    page: number = 1,
    limit: number = 20,
    sortOrd?: string,
    sortField?: string
  ): Promise<ProductsData[]> {
    // параметры для постраничной навигации
    const params: any = { page, limit };
    // сортировка по порядку и полю (назв.,цена,рейтинг)
    if (sortOrd) params.sortOrd = sortOrd;
    if (sortField) params.sortField = sortField;
    // базовый URL получ.всех Продуктов
    let url = "products/getall";
    // дополнение URL парам.из props (для 1го знач. и мн.знач.ч/з разделитель(_))
    if (categoryId) url += `/categoryId/${categoryId}`;
    if (brandId) url += `/brandId/${brandId}`;
    // req/res
    return handleRequest(
      () => guestInstance.get<ProductsData[]>(url, { params }),
      "Products/GetAll"
    );
  },

  /**
   * Обновление Продукта
   * @param id - ID Продукта
   * @param product - Обновляемые данные Продукта
   */
  async updateProduct(
    id: number,
    product: ProductsData
  ): Promise<ProductsData> {
    return handleRequest(
      () => authInstance.put<ProductsData>(`products/update/${id}`, product),
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
