import axios from 'axios';
import { CustomerOrder } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const api = axios.create({ baseURL: `${BASE_URL}/api` });

export async function fetchOrders(): Promise<CustomerOrder[]> {
  const { data } = await api.get<CustomerOrder[]>('/orders');
  return data;
}

export async function createOrder(
  order: Omit<CustomerOrder, 'id' | 'orderId' | 'orderDate' | 'customerId' | 'totalAmount'>
): Promise<CustomerOrder> {
  const { data } = await api.post<CustomerOrder>('/orders', order);
  return data;
}

export async function updateOrder(
  id: string,
  updates: Partial<CustomerOrder>
): Promise<CustomerOrder> {
  const { data } = await api.put<CustomerOrder>(`/orders/${id}`, updates);
  return data;
}

export async function deleteOrder(id: string): Promise<void> {
  await api.delete(`/orders/${id}`);
}

export async function bulkDeleteOrders(ids: string[]): Promise<void> {
  await api.delete('/orders', { data: { ids } });
}
