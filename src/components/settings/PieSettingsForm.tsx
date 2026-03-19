import { useForm } from 'react-hook-form';
import { PieChartConfig } from '@/types';

const DATA_OPTIONS = ['product', 'quantity', 'unitPrice', 'totalAmount', 'status', 'createdBy'];
const DATA_LABELS: Record<string, string> = {
  product: 'Product', quantity: 'Quantity', unitPrice: 'Unit price',
  totalAmount: 'Total amount', status: 'Status', createdBy: 'Created by',
};

interface Props {
  config: PieChartConfig;
  onSave: (config: Partial<PieChartConfig>) => void;
}

export default function PieSettingsForm({ config, onSave }: Props) {
  const { register, handleSubmit } = useForm<PieChartConfig>({ defaultValues: config });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Widget Title</label>
        <input {...register('title')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Widget Type</label>
        <input readOnly value="Pie chart" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400" />
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
        <label className="block text-xs text-gray-500 mb-1">Choose Chart Data</label>
        <select {...register('dataField')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
          {DATA_OPTIONS.map((o) => <option key={o} value={o}>{DATA_LABELS[o]}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="showLegend" {...register('showLegend')} className="w-4 h-4 accent-primary" />
        <label htmlFor="showLegend" className="text-sm text-gray-600">Show legend</label>
      </div>
      <button type="submit" className="w-full py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark">Save</button>
    </form>
  );
}
