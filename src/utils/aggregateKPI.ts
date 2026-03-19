import { CustomerOrder } from '@/types';

const NON_NUMERIC_FIELDS: Array<keyof CustomerOrder> = [
  'id', 'customerId', 'firstName', 'lastName', 'email', 'phone',
  'street', 'city', 'state', 'postalCode', 'country',
  'orderId', 'orderDate', 'product', 'createdBy', 'status',
];

export function isNonNumericField(metric: keyof CustomerOrder): boolean {
  return NON_NUMERIC_FIELDS.includes(metric);
}

export function aggregateKPI(
  orders: CustomerOrder[],
  metric: keyof CustomerOrder,
  aggregation: 'Sum' | 'Average' | 'Count'
): number {
  if (aggregation === 'Count' || isNonNumericField(metric)) {
    return orders.length;
  }
  const values = orders.map((o) => Number(o[metric])).filter((v) => !isNaN(v));
  if (aggregation === 'Sum') return values.reduce((a, b) => a + b, 0);
  if (aggregation === 'Average') return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  return 0;
}

export function formatKPIValue(value: number, dataFormat: 'Number' | 'Currency', decimalPrecision: number): string {
  const rounded = value.toFixed(decimalPrecision);
  return dataFormat === 'Currency' ? `$${rounded}` : rounded;
}
