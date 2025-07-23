// типы Корзины/Заказа и их Продуктов

export type BasketProduct = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type BasketData = {
  id: number;
  products: BasketProduct[];
  userId: number;
  total: number;
};

// Заказ и его Позиции (Продукты)
export type OrderData = {
  id?: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  amount: number; // сумма
  status?: number;
  comment?: string;
  items?: OrderItemData[];
};

export type OrderItemData = {
  id?: number;
  name: string;
  price: number; // цена
  quantity: number; // количество
  orderId?: number;
};
