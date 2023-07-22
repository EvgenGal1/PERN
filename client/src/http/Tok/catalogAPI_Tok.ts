// ^ HTTP-запросы на сервер для работы с каталогом товаров
import { guestInstance, authInstance } from "./index_Tok";

/*
 * Создание, обновление и удаление категории, получение списка всех Категорий
 */
export const createCategory = async (category: string | any) => {
  const { data } = await authInstance.post("category/create", category);
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

export const fetchCategory = async (id: number) => {
  const { data } = await guestInstance.get(`category/getone/${id}`);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await guestInstance.get("category/getall");
  return data;
};

/*
 * Создание, обновление и удаление бренда, получение списка всех Брендов
 */
export const createBrand = async (brand: string | any) => {
  const { data } = await authInstance.post("brand/create", brand);
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

export const fetchBrand = async (id: number) => {
  const { data } = await guestInstance.get(`brand/getone/${id}`);
  return data;
};

export const fetchBrands = async () => {
  const { data } = await guestInstance.get("brand/getall");
  return data;
};

/*
 * Создание, обновление и удаление товара, получение списка всех Товаров
 */
export const createProduct = async (product: string | any) => {
  const { data } = await authInstance.post("product/create", product);
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

export const fetchAllProducts = async (
  categoryId: number | null | any,
  brandId: number | null | any,
  page: number,
  limit: number,
  sortOrd: string,
  sortField: string
) => {
  // http://localhost:5050/api/product/getall?page=1&limit=20
  // http://proektory/26960370/filters?text=проектор&hid=191219&local-offers-first=0&rs=eJwzam
  let url = "product/getall";
  // фильтрация товаров по категории и/или бренду
  // console.log("fetProd categoryId " + categoryId);
  // console.log("fetProd brandId " + brandId);
  // console.log("fetProd limit " + limit);

  if (categoryId != null || brandId != null) {
    // console.log(categoryId?.length);
    // console.log("000 : " + 0);
    // логика добавления к URL до.парам. е/и их больше 1го
    if (categoryId?.length > 1 || brandId?.length > 1) {
      // console.log("111 : " + 111);
      // ~ попеременное подтягивание (первые i стирает, оставляет последний)
      // for (let i of categoryId) {
      // console.log(i);
      // let url2 = url;
      //
      // url2 = url2 + "?" + "categoryId" + "=" + i;
      // url = url + "?" + "categoryId" + "=" + i;
      //
      // let url2 = new URL("https://google.com/");
      // url2.searchParams.set("categoryId", i);
      // console.log(url /* 2 */);
      // }
      // ~ раб
      var myArray = categoryId;
      var baseUrl = url;
      var paramName = "categoryId_q=";
      var arrayAsString = "?" + paramName + myArray.join("&" + paramName);
      var urlWithParams = baseUrl + arrayAsString;
      url = urlWithParams;
      // console.log("urlWithParams : " + urlWithParams);
      //
      // field1=value1&field2=value2&field3=value3
      //
      // let url = new URL('https://google.com/search');
      // url.searchParams.set('q', 'test me!'); // добавим параметр, содержащий пробел и !
      // alert(url); // https://google.com/search?q=test+me%21
    }

    // е/и Один параметр
    // console.log("brandIdtypeof : " + typeof brandId);
    // console.log("brandId.length : " + brandId?.length);
    // console.log("categoryId typeof : " + typeof categoryId);
    // console.log("categoryId.length : " + categoryId?.length);
    // console.log("222 : " + 222);
    // console.log(typeof categoryId === "number");
    // console.log(isNaN(categoryId));
    // console.log(typeof brandId === "number");
    // console.log(isNaN(brandId));
    if (
      // (categoryId != null || brandId != null) &&
      // categoryId.length === 1 || brandId.length === 1
      //
      // categoryId?.length < 2 ||
      // brandId?.length < 2
      //
      // typeof categoryId === "number" ||
      // typeof brandId === "number"
      //
      typeof categoryId === ("number" || "object") ||
      typeof brandId === ("number" || "object")
    ) {
      // console.log("333 : " + 333);
      // if (categoryId.length === 1 || brandId.length === 1) {
      if (categoryId) url = url + "/categoryId/" + categoryId;
      if (brandId) url = url + "/brandId/" + brandId;
      // }
    }
  }
  // console.log("url ВСЁ : " + url);
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

export const fetchOneProduct = async (id: number) => {
  const { data } = await guestInstance.get(`product/getone/${id}`);
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
