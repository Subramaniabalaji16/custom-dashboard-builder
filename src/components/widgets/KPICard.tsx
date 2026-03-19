import { CustomerOrder, KPIConfig } from '@/types';
import { aggregateKPI, formatKPIValue } from '@/utils/aggregateKPI';
import { TrendingUp } from 'lucide-react';

interface Props {
  config: KPIConfig;
  orders: CustomerOrder[];
}

export default function KPICard({ config, orders }: Props) {
  const value = aggregateKPI(orders, config.metric, config.aggregation);
  const formatted = formatKPIValue(value, config.dataFormat, config.decimalPrecision);

  return (
    <div className="flex flex-col justify-between h-full p-4 bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{config.title}</span>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <TrendingUp size={16} className="text-primary" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{formatted}</p>
        {config.description && <p className="text-xs text-gray-400 mt-1 truncate">{config.description}</p>}
      </div>
    </div>
  );
}
