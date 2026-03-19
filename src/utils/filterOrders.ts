import { CustomerOrder, DateFilterOption } from '@/types';

export function filterOrdersByDate(orders: CustomerOrder[], filter: DateFilterOption): CustomerOrder[] {
  if (filter === 'all') return orders;
  const now = new Date();
  const cutoff = new Date();
  if (filter === 'today') {
    cutoff.setHours(0, 0, 0, 0);
  } else if (filter === '7d') {
    cutoff.setDate(now.getDate() - 7);
  } else if (filter === '30d') {
    cutoff.setDate(now.getDate() - 30);
  } else if (filter === '90d') {
    cutoff.setDate(now.getDate() - 90);
  }
  return orders.filter((o) => new Date(o.orderDate) >= cutoff);
}
