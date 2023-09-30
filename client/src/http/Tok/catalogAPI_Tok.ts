// ^ HTTP-запросы на сервер для работы с каталогом товаров
import { guestInstance, authInstance } from "./index_Tok";

/*
 * Создание, обновление и удаление категории, получение списка всех Категорий
 */
export const createCategory = async (category: string | any) => {
  const { data } = await authInstance.post("category/create", category);
  return data;
};

export const fetchCategory = async (id: number) => {
  const { data } = await guestInstance.get(`category/getone/${id}`);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await guestInstance.get("category/getall");
  return data;
};

export const updateCategory = async (id: number, category: string | any) => {
  const { data } = await authInstance.put(`category/update/${id}`, category);
  return data;
};

export const deleteCategory = async (id: number) => {
  const { data } = await authInstance.delete(`category/delete/${id}`);
  return data;
};

/*
 * Создание, обновление и удаление бренда, получение списка всех Брендов
 */
export const createBrand = async (brand: string | any) => {
  const { data } = await authInstance.post("brand/create", brand);
  return data;
};

export const fetchBrand = async (id: number) => {
  const { data } = await guestInstance.get(`brand/getone/${id}`);
  return data;
};

export const fetchBrands = async () => {
  const { data } = await guestInstance.get("brand/getall");
  return data;
};

export const updateBrand = async (id: number, brand: string | any) => {
  const { data } = await authInstance.put(`brand/update/${id}`, brand);
  return data;
};

export const deleteBrand = async (id: number) => {
  const { data } = await authInstance.delete(`brand/delete/${id}`);
  return data;
};

/*
 * Создание, обновление и удаление товара, получение списка всех Товаров
 */
export const createProduct = async (product: string | any) => {
  const { data } = await authInstance.post("product/create", product);
  return data;
};

export const fetchOneProduct = async (id: number) => {
  const { data } = await guestInstance.get(`product/getone/${id}`);
  return data;
};

export const fetchAllProducts = async (
  categoryId: number | null | any,
  brandId: number | null | any,
  page: number,
  limit: number,
  sortOrd: string,
  sortField: string
) => {
  // console.log("API Prod categoryId " + categoryId);
  // console.log("API Prod brandId " + brandId);

  // базовый URL получ.всех Товаров
  let url = "product/getall";

  // дополнение URL парам.из props (для 1го знач. и мн.знач.ч/з разделитель(_))
  // if (categoryId != null || brandId != null) {
  if (categoryId) url = url + "/categoryId/" + categoryId;
  if (brandId) url = url + "/brandId/" + brandId;
  // }

  // console.log("API Prod URL === : " + url);
  const { data } = await guestInstance.get(url, {
    params: {
      // GET-параметры для постраничной навигации
      page,
      limit,
      // сортировка по порядку и полю (назв.,цена,рейтинг)
      sortOrd,
      sortField,
    },
  });
  return data;
};

export const updateProduct = async (id: number, product: string | any) => {
  const { data } = await authInstance.put(`product/update/${id}`, product);
  return data;
};

export const deleteProduct = async (id: number) => {
  const { data } = await authInstance.delete(`product/delete/${id}`);
  return data;
};

/*
 * Создание, обновление Рейтинга Товара
 */
export const fetchProdRating = async (id: number) => {
  const { data } = await guestInstance.get(`rating/product/${id}`);
  return data;
};

export const createProdRating = async (
  authUserId: number,
  productId: number,
  rate: number
) => {
  const { data } = await authInstance.post(
    `rating/product/${productId}/rate/${rate}`
  );
  return data;
};

/*
 * Создание, обновление и удаление Характеристик товара
 */
export const createProperty = async (productId: number, property: any) => {
  const { data } = await authInstance.post(
    `product/${productId}/property/create`,
    property
  );
  return data;
};

export const updateProperty = async (
  productId: number,
  id: number,
  property: any
) => {
  const { data } = await authInstance.put(
    `product/${productId}/property/update/${id}`,
    property
  );
  return data;
};

export const deleteProperty = async (productId: number, id: number) => {
  const { data } = await authInstance.delete(
    `product/${productId}/property/delete/${id}`
  );
  return data;
};
