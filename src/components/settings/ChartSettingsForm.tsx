import { useForm } from 'react-hook-form';
import { AxisChartConfig } from '@/types';

const AXIS_OPTIONS = ['product', 'quantity', 'unitPrice', 'totalAmount', 'status', 'createdBy', 'orderDate'];
const AXIS_LABELS: Record<string, string> = {
  product: 'Product', quantity: 'Quantity', unitPrice: 'Unit price',
  totalAmount: 'Total amount', status: 'Status', createdBy: 'Created by', orderDate: 'Duration',
};

const TYPE_LABELS: Record<string, string> = {
  bar: 'Bar chart', line: 'Line chart', area: 'Area chart', scatter: 'Scatter plot chart',
};

interface Props {
  config: AxisChartConfig;
  onSave: (config: Partial<AxisChartConfig>) => void;
}

export default function ChartSettingsForm({ config, onSave }: Props) {
  const { register, handleSubmit } = useForm<AxisChartConfig>({ defaultValues: config });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Widget Title</label>
        <input {...register('title')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Widget Type</label>
        <input readOnly value={TYPE_LABELS[config.type] || config.type} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Description</label>
        <textarea {...register('description')} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Width (Columns)</label>
          <input type="number" min={1} {...register('w', { valueAsNumber: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Height (Rows)</label>
          <input type="number" min={1} {...register('h', { valueAsNumber: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">X-Axis</label>
        <select {...register('xAxis')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
          {AXIS_OPTIONS.map((o) => <option key={o} value={o}>{AXIS_LABELS[o]}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Y-Axis</label>
        <select {...register('yAxis')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
          {AXIS_OPTIONS.map((o) => <option key={o} value={o}>{AXIS_LABELS[o]}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Chart Color</label>
        <div className="flex gap-2">
          <input type="color" {...register('color')} className="w-10 h-9 rounded border border-gray-300 cursor-pointer p-0.5" />
          <input {...register('color')} placeholder="#54bd95" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="showDataLabel" {...register('showDataLabel')} className="w-4 h-4 accent-primary" />
        <label htmlFor="showDataLabel" className="text-sm text-gray-600">Show data label</label>
      </div>
      <button type="submit" className="w-full py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark">Save</button>
    </form>
  );
}
