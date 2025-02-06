import { ProductsData } from "../../types/api/catalog.types";
import { handleRequest } from "../handleRequest";
import { authInstance, guestInstance } from "../axiosInstances";

export const productsAPI = {
  /**
   * Создание нового Продкта
   * @param product - Данные нового Продкта
   */
  async createProduct(product: ProductsData): Promise<ProductsData> {
    return handleRequest(
      () => authInstance.post<ProductsData>("products/create", product),
      "Products/Create"
    );
  },

  /**
   * Получение Одного Продкта по ID
   * @param id - ID Продкта
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
    // базовый URL получ.всех Товаров
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
   * Обновление Продкта
   * @param id - ID Продкта
   * @param product - Обновляемые данные Продкта
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
   * Удаление Продкта
   * @param id - ID Продкта
   */
  async deleteProduct(id: number): Promise<void> {
    return handleRequest(
      () => authInstance.delete(`products/delete/${id}`),
      "Products/Delete"
    );
  },
};
