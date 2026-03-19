import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CustomerOrder } from '@/types';
import { X } from 'lucide-react';

type FormData = Omit<CustomerOrder, 'id' | 'orderId' | 'orderDate' | 'customerId' | 'totalAmount'>;

interface Props {
  order?: CustomerOrder;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
}

const COUNTRIES = ['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'];
const PRODUCTS = [
  'Fiber Internet 300 Mbps',
  '5G Unlimited Mobile Plan',
  'Fiber Internet 1 Gbps',
  'Business Internet 500 Mbps',
  'VoIP Corporate Package',
];
const STATUSES = ['Pending', 'In progress', 'Completed'];
const CREATED_BY = ['Mr. Michael Harris', 'Mr. Ryan Cooper', 'Ms. Olivia Carter', 'Mr. Lucas Martin'];

export default function OrderForm({ order, onSubmit, onClose }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      quantity: 1,
      status: 'Pending',
      ...order,
    },
  });

  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice');

  useEffect(() => {
    if (order) {
      Object.entries(order).forEach(([key, value]) => {
        setValue(key as keyof FormData, value as never);
      });
    }
  }, [order, setValue]);

  const totalAmount = (Number(quantity) || 0) * (Number(unitPrice) || 0);

  const onFormSubmit = async (data: FormData) => {
    await onSubmit(data);
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
      hasError ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{order ? 'Edit Order' : 'Create Order'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="px-6 py-5 space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">First Name *</label>
                <input {...register('firstName', { required: 'Please fill the field' })} className={inputClass(!!errors.firstName)} />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last Name *</label>
                <input {...register('lastName', { required: 'Please fill the field' })} className={inputClass(!!errors.lastName)} />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email ID *</label>
                <input {...register('email', { required: 'Please fill the field' })} className={inputClass(!!errors.email)} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone Number *</label>
                <input {...register('phone', { required: 'Please fill the field' })} className={inputClass(!!errors.phone)} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Street Address *</label>
                <input {...register('street', { required: 'Please fill the field' })} className={inputClass(!!errors.street)} />
                {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">City *</label>
                <input {...register('city', { required: 'Please fill the field' })} className={inputClass(!!errors.city)} />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">State / Province *</label>
                <input {...register('state', { required: 'Please fill the field' })} className={inputClass(!!errors.state)} />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Postal Code *</label>
                <input {...register('postalCode', { required: 'Please fill the field' })} className={inputClass(!!errors.postalCode)} />
                {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Country *</label>
                <select {...register('country', { required: 'Please fill the field' })} className={inputClass(!!errors.country)}>
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Order Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Choose Product *</label>
                <select {...register('product', { required: 'Please fill the field' })} className={inputClass(!!errors.product)}>
                  <option value="">Select product</option>
                  {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quantity *</label>
                <input
                  type="number"
                  min={1}
                  {...register('quantity', { required: 'Please fill the field', min: { value: 1, message: 'Minimum 1' }, valueAsNumber: true })}
                  className={inputClass(!!errors.quantity)}
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Unit Price *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    {...register('unitPrice', { required: 'Please fill the field', min: 0, valueAsNumber: true })}
                    className={`${inputClass(!!errors.unitPrice)} pl-7`}
                  />
                </div>
                {errors.unitPrice && <p className="text-red-500 text-xs mt-1">{errors.unitPrice.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Total Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    readOnly
                    value={totalAmount.toFixed(2)}
                    className="w-full pl-7 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status *</label>
                <select {...register('status', { required: 'Please fill the field' })} className={inputClass(!!errors.status)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Created By *</label>
                <select {...register('createdBy', { required: 'Please fill the field' })} className={inputClass(!!errors.createdBy)}>
                  <option value="">Select person</option>
                  {CREATED_BY.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.createdBy && <p className="text-red-500 text-xs mt-1">{errors.createdBy.message}</p>}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : order ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
