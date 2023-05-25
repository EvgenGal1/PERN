// ^ HTTP-запросы на сервер при работе с корзиной
import { guestInstance } from "./index_Tok";

export const fetchBasket = async () => {
  const { data } = await guestInstance.get("basket/getone");
  return data;
};

export const append = async (id: number) => {
  const { data } = await guestInstance.put(`basket/product/${id}/append/1`);
  return data;
};

export const increment = async (id: number) => {
  const { data } = await guestInstance.put(`basket/product/${id}/increment/1`);
  return data;
};

export const decrement = async (id: number) => {
  const { data } = await guestInstance.put(`basket/product/${id}/decrement/1`);
  return data;
};

export const remove = async (id: number) => {
  const { data } = await guestInstance.put(`basket/product/${id}/remove`);
  return data;
};

export const clear = async () => {
  const { data } = await guestInstance.put(`basket/clear`);
  return data;
};
