export interface OrderCreateDto {
  id?: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  amount?: number;
  status?: number;
  comment?: string;
  items: OrderItemCreateDto[];
}

export interface OrderUpdateDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  comment?: string;
  items?: OrderItemCreateDto[];
}

export interface OrderItemCreateDto {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  orderId?: number;
}

export interface OrderData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  amount?: number;
  status?: number;
  comment?: string | null;
  items?: OrderItemCreateDto[];
}

export interface OrderUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  comment?: string | null;
  items?: OrderItemCreateDto[];
}

// статусы заказа
export enum OrderStatus {
  NEW = 2001,
  IN_PROGRESS = 2002,
  COMPLETED = 2010,
  CANCELLED = 9999,
}
