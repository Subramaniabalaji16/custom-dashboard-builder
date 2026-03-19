import { useForm, useFieldArray } from 'react-hook-form';
import { TableConfig, CustomerOrder } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

const ALL_COLUMNS: Array<keyof CustomerOrder> = [
  'customerId', 'firstName', 'lastName', 'email', 'phone', 'street',
  'orderId', 'orderDate', 'product', 'quantity', 'unitPrice', 'totalAmount', 'status', 'createdBy',
];
const COL_LABELS: Record<string, string> = {
  customerId: 'Customer ID', firstName: 'Customer name', lastName: 'Last name',
  email: 'Email id', phone: 'Phone number', street: 'Address',
  orderId: 'Order ID', orderDate: 'Order date', product: 'Product',
  quantity: 'Quantity', unitPrice: 'Unit price', totalAmount: 'Total amount',
  status: 'Status', createdBy: 'Created by',
};

interface Props {
  config: TableConfig;
  onSave: (config: Partial<TableConfig>) => void;
}

export default function TableSettingsForm({ config, onSave }: Props) {
  const { register, handleSubmit, watch, control } = useForm<TableConfig>({ defaultValues: config });
  const { fields, append, remove } = useFieldArray({ control, name: 'filters' });
  const applyFilter = watch('applyFilter');

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Widget Title</label>
        <input {...register('title')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Widget Type</label>
        <input readOnly value="Table" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400" />
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
        <label className="block text-xs text-gray-500 mb-1">Choose Columns</label>
        <div className="border border-gray-300 rounded-lg p-2 max-h-36 overflow-y-auto space-y-1">
          {ALL_COLUMNS.map((col) => (
            <label key={col} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" value={col} {...register('columns')} defaultChecked={config.columns.includes(col)} className="accent-primary" />
              {COL_LABELS[col]}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Sort By</label>
        <select {...register('sortBy')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
          <option value="orderDate">Order date</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Pagination</label>
        <select {...register('pageSize', { valueAsNumber: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="applyFilter" {...register('applyFilter')} className="w-4 h-4 accent-primary" />
        <label htmlFor="applyFilter" className="text-sm text-gray-600">Apply filter</label>
      </div>
      {applyFilter && (
        <div className="space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-center">
              <select {...register(`filters.${i}.field`)} className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs">
                {ALL_COLUMNS.map((c) => <option key={c} value={c}>{COL_LABELS[c]}</option>)}
              </select>
              <select {...register(`filters.${i}.operator`)} className="px-2 py-1.5 border border-gray-300 rounded text-xs">
                <option value="equals">equals</option>
                <option value="contains">contains</option>
                <option value="gt">&gt;</option>
                <option value="lt">&lt;</option>
              </select>
              <input {...register(`filters.${i}.value`)} placeholder="value" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs" />
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ field: 'product', operator: 'equals', value: '' })}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus size={12} /> Add filter
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Font Size</label>
          <input type="number" min={12} max={18} {...register('fontSize', { valueAsNumber: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Header Background</label>
          <div className="flex gap-2">
            <input type="color" {...register('headerBackground')} className="w-10 h-9 rounded border border-gray-300 cursor-pointer p-0.5" />
            <input {...register('headerBackground')} className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-xs font-mono" />
          </div>
        </div>
      </div>
      <button type="submit" className="w-full py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark">Save</button>
    </form>
  );
}
