import { DateFilterOption } from '@/types';
import { useDashboardStore } from '@/store/dashboardStore';

const OPTIONS: { value: DateFilterOption; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
];

export default function DateFilter() {
  const { dateFilter, setDateFilter } = useDashboardStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Show data for</span>
      <select
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value as DateFilterOption)}
        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
