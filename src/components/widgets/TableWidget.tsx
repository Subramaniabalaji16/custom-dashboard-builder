import { useState } from 'react';
import { CustomerOrder, TableConfig } from '@/types';
import { applyFilters, sortOrders, paginateOrders, getTotalPages } from '@/utils/tableUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from '@/components/orders/StatusBadge';

interface Props {
  config: TableConfig;
  orders: CustomerOrder[];
}

export default function TableWidget({ config, orders }: Props) {
  const [page, setPage] = useState(1);

  const filtered = config.applyFilter ? applyFilters(orders, config.filters) : orders;
  const sorted = sortOrders(filtered, config.sortBy);
  const totalPages = getTotalPages(sorted.length, config.pageSize);
  const paginated = paginateOrders(sorted, page, config.pageSize);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <p className="text-xs font-medium text-gray-500 px-2 pt-2 mb-1 truncate">{config.title}</p>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: config.headerBackground }}>
              {config.columns.map((col) => (
                <th key={col} className="px-3 py-2 text-left text-white text-xs font-semibold whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                {config.columns.map((col) => (
                  <td key={col} className="px-3 py-2 whitespace-nowrap" style={{ fontSize: config.fontSize }}>
                    {col === 'status' ? (
                      <StatusBadge status={order.status} />
                    ) : col === 'unitPrice' || col === 'totalAmount' ? (
                      `$${Number(order[col]).toFixed(2)}`
                    ) : (
                      String(order[col] ?? '')
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-1 px-2 py-1 border-t border-gray-100">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-40">
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-gray-500">{page}/{totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 rounded hover:bg-gray-100 disabled:opacity-40">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
