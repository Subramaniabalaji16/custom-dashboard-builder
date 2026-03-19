import { CustomerOrder, FilterCondition } from '@/types';

export function applyFilters(orders: CustomerOrder[], conditions: FilterCondition[]): CustomerOrder[] {
  if (!conditions.length) return orders;
  return orders.filter((order) =>
    conditions.every((cond) => {
      const val = String(order[cond.field]).toLowerCase();
      const target = cond.value.toLowerCase();
      switch (cond.operator) {
        case 'equals': return val === target;
        case 'contains': return val.includes(target);
        case 'gt': return Number(order[cond.field]) > Number(cond.value);
        case 'lt': return Number(order[cond.field]) < Number(cond.value);
        default: return true;
      }
    })
  );
}

export function sortOrders(orders: CustomerOrder[], sortBy: 'asc' | 'desc' | 'orderDate'): CustomerOrder[] {
  const sorted = [...orders];
  if (sortBy === 'orderDate') {
    return sorted.sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());
  }
  if (sortBy === 'asc') {
    return sorted.sort((a, b) => a.orderId.localeCompare(b.orderId));
  }
  if (sortBy === 'desc') {
    return sorted.sort((a, b) => b.orderId.localeCompare(a.orderId));
  }
  return sorted;
}

export function paginateOrders(orders: CustomerOrder[], page: number, pageSize: number): CustomerOrder[] {
  const start = (page - 1) * pageSize;
  return orders.slice(start, start + pageSize);
}

export function getTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize);
}
