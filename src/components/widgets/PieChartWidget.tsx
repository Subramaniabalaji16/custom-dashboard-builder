import { CustomerOrder, PieChartConfig } from '@/types';
import { groupByField } from '@/utils/chartUtils';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#54bd95', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6'];

interface Props {
  config: PieChartConfig;
  orders: CustomerOrder[];
}

export default function PieChartWidget({ config, orders }: Props) {
  const data = groupByField(orders, config.dataField as keyof CustomerOrder);

  return (
    <div className="h-full w-full p-2">
      <p className="text-xs font-medium text-gray-500 mb-1 truncate">{config.title}</p>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          {config.showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
