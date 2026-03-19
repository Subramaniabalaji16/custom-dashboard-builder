import { useEffect, useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { useOrdersStore } from '@/store/ordersStore';
import { CustomerOrder } from '@/types';
import OrdersTable from '@/components/orders/OrdersTable';
import OrderForm from '@/components/orders/OrderForm';

export default function OrdersPage() {
  const { orders, loading, loadOrders, addOrder, updateOrder, deleteOrder, bulkDeleteOrders } = useOrdersStore();
  const [showForm, setShowForm] = useState(false);
  const [editOrder, setEditOrder] = useState<CustomerOrder | undefined>();

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleSubmit = async (data: Omit<CustomerOrder, 'id' | 'orderId' | 'orderDate' | 'customerId' | 'totalAmount'>) => {
    if (editOrder) {
      await updateOrder(editOrder.id, data);
    } else {
      await addOrder(data);
    }
    setShowForm(false);
    setEditOrder(undefined);
  };

  const handleEdit = (order: CustomerOrder) => {
    setEditOrder(order);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditOrder(undefined);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold text-gray-800">Customer Orders</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark"
        >
          <Plus size={16} /> Create Order
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-white m-6 rounded-xl border border-gray-200 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <ShoppingCart size={48} strokeWidth={1} />
            <p className="text-sm">No orders yet. Click "Create Order" to get started.</p>
          </div>
        ) : (
          <OrdersTable orders={orders} onEdit={handleEdit} onDelete={deleteOrder} onBulkDelete={bulkDeleteOrders} />
        )}
      </div>

      {showForm && (
        <OrderForm order={editOrder} onSubmit={handleSubmit} onClose={handleClose} />
      )}
    </div>
  );
}
