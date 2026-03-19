import { CustomerOrder, WidgetConfig } from '@/types';
import { useOrdersStore } from '@/store/ordersStore';
import { useDashboardStore } from '@/store/dashboardStore';
import { filterOrdersByDate } from '@/utils/filterOrders';
import KPICard from './KPICard';
import ChartWidget from './ChartWidget';
import PieChartWidget from './PieChartWidget';
import TableWidget from './TableWidget';

interface Props {
  config: WidgetConfig;
  orders?: CustomerOrder[];
}

export default function WidgetRenderer({ config, orders: ordersProp }: Props) {
  const storeOrders = useOrdersStore((s) => s.orders);
  const dateFilter = useDashboardStore((s) => s.dateFilter);
  const rawOrders = ordersProp ?? storeOrders;
  const orders = filterOrdersByDate(rawOrders, dateFilter);

  switch (config.type) {
    case 'kpi':
      return <KPICard config={config} orders={orders} />;
    case 'bar':
    case 'line':
    case 'area':
    case 'scatter':
      return <ChartWidget config={config} orders={orders} />;
    case 'pie':
      return <PieChartWidget config={config} orders={orders} />;
    case 'table':
      return <TableWidget config={config} orders={orders} />;
    default:
      return <div className="p-4 text-gray-400 text-sm">Unknown widget</div>;
  }
}
