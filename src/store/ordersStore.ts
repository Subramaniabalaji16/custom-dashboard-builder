import { create } from 'zustand';
import { CustomerOrder } from '@/types';
import * as ordersApi from '@/api/ordersApi';

interface OrdersStore {
  orders: CustomerOrder[];
  loading: boolean;
  error: string | null;
  loadOrders: () => Promise<void>;
  addOrder: (order: Omit<CustomerOrder, 'id' | 'orderId' | 'orderDate' | 'customerId' | 'totalAmount'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<CustomerOrder>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  bulkDeleteOrders: (ids: string[]) => Promise<void>;
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  orders: [],
  loading: false,
  error: null,

  loadOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await ordersApi.fetchOrders();
      set({ orders, loading: false });
    } catch {
      set({ error: 'Failed to load orders', loading: false });
    }
  },

  addOrder: async (order) => {
    const created = await ordersApi.createOrder(order);
    set((state) => ({ orders: [created, ...state.orders] }));
  },

  updateOrder: async (id, updates) => {
    const updated = await ordersApi.updateOrder(id, updates);
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? updated : o)),
    }));
  },

  deleteOrder: async (id) => {
    await ordersApi.deleteOrder(id);
    set((state) => ({ orders: state.orders.filter((o) => o.id !== id) }));
  },

  bulkDeleteOrders: async (ids) => {
    await ordersApi.bulkDeleteOrders(ids);
    set((state) => ({ orders: state.orders.filter((o) => !ids.includes(o.id)) }));
  },
}));
