import { useState } from 'react';
import { CustomerOrder } from '@/types';
import StatusBadge from './StatusBadge';
import ContextMenu from './ContextMenu';
import DeleteConfirmModal from './DeleteConfirmModal';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

interface Props {
  orders: CustomerOrder[];
  onEdit: (order: CustomerOrder) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
}

const COLUMNS: { key: keyof CustomerOrder; label: string }[] = [
  { key: 'customerId', label: 'Customer ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'orderId', label: 'Order ID' },
  { key: 'product', label: 'Product' },
  { key: 'quantity', label: 'Qty' },
  { key: 'unitPrice', label: 'Unit Price' },
  { key: 'totalAmount', label: 'Total' },
  { key: 'status', label: 'Status' },
  { key: 'createdBy', label: 'Created By' },
];

const PAGE_SIZE = 10;

export default function OrdersTable({ orders, onEdit, onDelete, onBulkDelete }: Props) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; order: CustomerOrder } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginated = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allOnPageSelected = paginated.length > 0 && paginated.every((o) => selected.has(o.id));

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allOnPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        paginated.forEach((o) => next.delete(o.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        paginated.forEach((o) => next.add(o.id));
        return next;
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent, order: CustomerOrder) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, order });
  };

  const handleBulkDelete = () => {
    onBulkDelete(Array.from(selected));
    setSelected(new Set());
    setShowBulkConfirm(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-red-50 border-b border-red-100">
          <span className="text-sm text-red-600 font-medium">{selected.size} selected</span>
          <button
            onClick={() => setShowBulkConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
          >
            <Trash2 size={13} /> Delete Selected
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-primary rounded"
                />
              </th>
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((order) => (
              <tr
                key={order.id}
                onContextMenu={(e) => handleContextMenu(e, order)}
                className={`hover:bg-gray-50 cursor-context-menu ${selected.has(order.id) ? 'bg-primary/5' : ''}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(order.id)}
                    onChange={() => toggleRow(order.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 accent-primary rounded"
                  />
                </td>
                {COLUMNS.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {col.key === 'status' ? (
                      <StatusBadge status={order.status} />
                    ) : col.key === 'unitPrice' || col.key === 'totalAmount' ? (
                      `$${Number(order[col.key]).toFixed(2)}`
                    ) : (
                      String(order[col.key] ?? '')
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, orders.length)} of {orders.length}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-40">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-600 px-2">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 rounded hover:bg-gray-100 disabled:opacity-40">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onEdit={() => onEdit(contextMenu.order)}
          onDelete={() => setDeleteTarget(contextMenu.order.id)}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Single delete confirm */}
      {deleteTarget && (
        <DeleteConfirmModal
          onConfirm={() => { onDelete(deleteTarget); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Bulk delete confirm */}
      {showBulkConfirm && (
        <DeleteConfirmModal
          onConfirm={handleBulkDelete}
          onCancel={() => setShowBulkConfirm(false)}
        />
      )}
    </div>
  );
}
