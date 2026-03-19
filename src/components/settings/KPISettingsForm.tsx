import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { KPIConfig, CustomerOrder } from '@/types';
import { isNonNumericField } from '@/utils/aggregateKPI';

const METRICS: Array<keyof CustomerOrder> = [
  'customerId', 'firstName', 'email', 'street', 'orderDate',
  'product', 'createdBy', 'status', 'totalAmount', 'unitPrice', 'quantity',
];

const METRIC_LABELS: Record<string, string> = {
  customerId: 'Customer ID', firstName: 'Customer name', email: 'Email id',
  street: 'Address', orderDate: 'Order date', product: 'Product',
  createdBy: 'Created by', status: 'Status', totalAmount: 'Total amount',
  unitPrice: 'Unit price', quantity: 'Quantity',
};

interface Props {
  config: KPIConfig;
  onSave: (config: Partial<KPIConfig>) => void;
}

export default function KPISettingsForm({ config, onSave }: Props) {
  const { register, handleSubmit, watch, setValue } = useForm<KPIConfig>({ defaultValues: config });
  const metric = watch('metric');
  const nonNumeric = isNonNumericField(metric);

  useEffect(() => {
    if (nonNumeric) setValue('aggregation', 'Count');
  }, [nonNumeric, setValue]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Widget Title</label>
        <input {...register('title')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Widget Type</label>
        <input readOnly value="KPI" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Description</label>
        <textarea {...register('description')} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Width (Columns)</label>
          <input type="number" min={1} {...register('w', { valueAsNumber: true, min: 1 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Height (Rows)</label>
          <input type="number" min={1} {...register('h', { valueAsNumber: true, min: 1 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Select Metric</label>
        <select {...register('metric')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
          {METRICS.map((m) => <option key={m} value={m}>{METRIC_LABELS[m] || m}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Aggregation</label>
        <select {...register('aggregation')} disabled={nonNumeric} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-400">
          <option value="Sum">Sum</option>
          <option value="Average">Average</option>
          <option value="Count">Count</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Data Format</label>
        <select {...register('dataFormat')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="Number">Number</option>
          <option value="Currency">Currency</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Decimal Precision</label>
        <input type="number" min={0} {...register('decimalPrecision', { valueAsNumber: true, min: 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>
      <button type="submit" className="w-full py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark">Save</button>
    </form>
  );
}
