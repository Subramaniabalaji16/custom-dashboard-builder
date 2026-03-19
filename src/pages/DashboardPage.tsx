import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useOrdersStore } from '@/store/ordersStore';
import DateFilter from '@/components/dashboard/DateFilter';
import WidgetGrid from '@/components/dashboard/WidgetGrid';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { layout, loading, loadDashboard } = useDashboardStore();
  const { loadOrders } = useOrdersStore();

  useEffect(() => {
    loadDashboard();
    loadOrders();
  }, [loadDashboard, loadOrders]);

  const hasWidgets = layout.lg.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold text-gray-800">Customer Orders</h1>
        <div className="flex items-center gap-4">
          <DateFilter />
          <button
            onClick={() => navigate('/dashboard/builder')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark"
          >
            <Settings size={16} /> Configure Dashboard
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">Loading...</div>
        ) : !hasWidgets ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
            <LayoutDashboard size={64} strokeWidth={1} />
            <p className="text-sm">No dashboard configured yet.</p>
            <button
              onClick={() => navigate('/dashboard/builder')}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark"
            >
              <Settings size={16} /> Configure Dashboard
            </button>
          </div>
        ) : (
          <WidgetGrid />
        )}
      </div>
    </div>
  );
}
