// Корзина и её Продукты
export interface BasketProduct {
  id?: number;
  name: string;
  price: number;
  quantity: number;
}

export interface BasketData {
  id: number;
  products: BasketProduct[];
  userId: number;
  total: number;
}

// Заказ и его Позиции (Продукты)
export interface OrderData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  amount: number; // сумма
  status?: number;
  comment?: string;
  items?: OrderItemData[];
}

export interface OrderItemData {
  id?: number;
  name: string;
  price: number; // цена
  quantity: number; // количество
  orderId?: number;
}
