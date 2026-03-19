import { CustomerOrder } from '@/types';

export function groupByField(
  orders: CustomerOrder[],
  field: keyof CustomerOrder
): { name: string; value: number }[] {
  const counts: Record<string, number> = {};
  for (const order of orders) {
    const key = String(order[field]);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function buildAxisChartData(
  orders: CustomerOrder[],
  xAxis: string,
  yAxis: string
): Record<string, unknown>[] {
  return orders.map((order) => ({
    [xAxis]: order[xAxis as keyof CustomerOrder],
    [yAxis]: order[yAxis as keyof CustomerOrder],
  }));
}
