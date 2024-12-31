// ^ HTTP-запросы на сервер при работе с корзиной

import { guestInstance } from "./indexAPI_Tok";

export const fetchBasket = async () => {
  try {
    const { data } = await guestInstance.get("basket/getone");
    return data;
  } catch (e: any) {
    const status = e?.response?.status;
    const errors = e?.response?.data?.errors;
    const message = e?.response?.data?.message;

    const data = { errors, message, status };
    return data;
  }
};

export const appendBasket = async (prodId: number) => {
  try {
    const { data } = await guestInstance.put(
      `basket/product/${prodId}/append/1`
    );

    return data;
  } catch (e: any) {
    const status = e?.response?.status;
    const errors = e?.response?.data?.errors;
    const message = e?.response?.data?.message;

    const data = { errors, message, status };
    return data;
  }
};

export const incrementBasket = async (id: number) => {
  const { data } = await guestInstance.put(`basket/product/${id}/increment/1`);
  return data;
};

export const decrementBasket = async (id: number) => {
  const { data } = await guestInstance.put(`basket/product/${id}/decrement/1`);
  return data;
};

export const removeBasket = async (id: number) => {
  const { data } = await guestInstance.put(`basket/product/${id}/remove`);
  return data;
};

export const clearBasket = async () => {
  const { data } = await guestInstance.put(`basket/clear`);
  return data;
};
