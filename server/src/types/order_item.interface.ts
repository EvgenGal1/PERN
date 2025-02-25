export interface OrderCreateDto {
  id?: number;
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
  comment?: string;
  items?: OrderItemCreateDto[];
}
