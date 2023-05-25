// ^ HTTP-запросы на сервер для работы с каталогом товаров
import jwt_decode from "jwt-decode";

import { guestInstance, authInstance } from "./index_Tok";

/*
 * Создание, обновление и удаление категории, получение списка всех категорий
 */
export const createCategory = async (category: string) => {
  const { data } = await authInstance.post("category/create", category);
  return data;
};

export const updateCategory = async (id: number, category: string) => {
  const { data } = await authInstance.put(`category/update/${id}`, category);
  return data;
};

export const deleteCategory = async (id: number) => {
  const { data } = await authInstance.delete(`category/delete/${id}`);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await guestInstance.get("category/getall");
  return data;
};

/*
 * Создание, обновление и удаление бренда, получение списка всех брендов
 */
export const createBrand = async (brand: string) => {
  const { data } = await authInstance.post("brand/create", brand);
  return data;
};

export const updateBrand = async (id: number, brand: string) => {
  const { data } = await authInstance.put(`brand/update/${id}`, brand);
  return data;
};

export const deleteBrand = async (id: number) => {
  const { data } = await authInstance.delete(`brand/delete/${id}`);
  return data;
};

export const fetchBrands = async () => {
  const { data } = await guestInstance.get("brand/getall");
  return data;
};

/*
 * Создание, обновление и удаление товара, получение списка всех товаров
 */
export const createProduct = async (product: string) => {
  const { data } = await authInstance.post("product/create", product);
  return data;
};

export const updateProduct = async (id: number, product: string) => {
  const { data } = await authInstance.put(`product/update/${id}`, product);
  return data;
};

export const deleteProduct = async (id: number) => {
  const { data } = await authInstance.delete(`product/delete/${id}`);
  return data;
};

export const fetchAllProducts = async (
  categoryId: number | null | any,
  brandId: number | null | any,
  page: number,
  limit: number
) => {
  let url = "product/getall";
  // фильтрация товаров по категории и/или бренду
  if (categoryId) url = url + "/categoryId/" + categoryId;
  if (brandId) url = url + "/brandId/" + brandId;
  const { data } = await guestInstance.get(url, {
    params: {
      // GET-параметры для постраничной навигации
      page,
      limit,
    },
  });
  return data;
};

export const fetchOneProduct = async (id: number) => {
  const { data } = await guestInstance.get(`product/getone/${id}`);
  return data;
};

export const fetchProdRating = async (id: number) => {
  const { data } = await guestInstance.get(`rating/product/${id}`);
  return data;
};
