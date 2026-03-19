import { X } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetConfig, KPIConfig, AxisChartConfig, PieChartConfig, TableConfig } from '@/types';
import KPISettingsForm from './KPISettingsForm';
import ChartSettingsForm from './ChartSettingsForm';
import PieSettingsForm from './PieSettingsForm';
import TableSettingsForm from './TableSettingsForm';

export default function SettingsPanel() {
  const { activeWidgetId, widgets, setActiveWidget, updateWidgetConfig } = useDashboardStore();

  if (!activeWidgetId) return null;
  const config = widgets[activeWidgetId];
  if (!config) return null;

  const handleSave = (updates: Partial<WidgetConfig>) => {
    updateWidgetConfig(activeWidgetId, updates);
    setActiveWidget(null);
  };

  const TYPE_LABELS: Record<string, string> = {
    kpi: 'KPI Card', bar: 'Bar Chart', line: 'Line Chart',
    area: 'Area Chart', scatter: 'Scatter Plot', pie: 'Pie Chart', table: 'Table',
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800">
          Configure {TYPE_LABELS[config.type] || config.type}
        </h3>
        <button onClick={() => setActiveWidget(null)} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {config.type === 'kpi' && (
          <KPISettingsForm config={config as KPIConfig} onSave={handleSave} />
        )}
        {(config.type === 'bar' || config.type === 'line' || config.type === 'area' || config.type === 'scatter') && (
          <ChartSettingsForm config={config as AxisChartConfig} onSave={handleSave} />
        )}
        {config.type === 'pie' && (
          <PieSettingsForm config={config as PieChartConfig} onSave={handleSave} />
        )}
        {config.type === 'table' && (
          <TableSettingsForm config={config as TableConfig} onSave={handleSave} />
        )}
      </div>
    </div>
  );
}
