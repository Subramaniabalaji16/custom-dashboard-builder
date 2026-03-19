import { useState } from 'react';
import { WidgetType } from '@/types';
import { BarChart2, LineChart, PieChart, AreaChart, ScatterChart, Table, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';

interface WidgetTypeItem {
  type: WidgetType;
  label: string;
  icon: React.ElementType;
}

const CATEGORIES: { label: string; items: WidgetTypeItem[] }[] = [
  {
    label: 'Charts',
    items: [
      { type: 'bar', label: 'Bar Chart', icon: BarChart2 },
      { type: 'line', label: 'Line Chart', icon: LineChart },
      { type: 'pie', label: 'Pie Chart', icon: PieChart },
      { type: 'area', label: 'Area Chart', icon: AreaChart },
      { type: 'scatter', label: 'Scatter Plot', icon: ScatterChart },
    ],
  },
  {
    label: 'Tables',
    items: [{ type: 'table', label: 'Table', icon: Table }],
  },
  {
    label: 'KPIs',
    items: [{ type: 'kpi', label: 'KPI Value', icon: TrendingUp }],
  },
];

interface Props {
  onDragStart: (type: WidgetType) => void;
}

export default function WidgetPanel({ onDragStart }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Charts: true, Tables: true, KPIs: true });

  const toggle = (label: string) => setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <div className="w-52 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
      <div className="px-4 py-3 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Widgets</p>
      </div>
      <div className="flex-1 py-2">
        {CATEGORIES.map((cat) => (
          <div key={cat.label}>
            <button
              onClick={() => toggle(cat.label)}
              className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              {cat.label}
              {expanded[cat.label] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {expanded[cat.label] && (
              <div className="pb-1">
                {cat.items.map(({ type, label, icon: Icon }) => (
                  <div
                    key={type}
                    draggable
                    onDragStart={() => onDragStart(type)}
                    className="flex items-center gap-2 mx-2 px-3 py-2 rounded-lg text-sm text-gray-600 cursor-grab hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/20 mb-1"
                  >
                    <Icon size={15} />
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
