import { useState } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import DeleteConfirmModal from '@/components/orders/DeleteConfirmModal';

interface Props {
  widgetId: string;
  onSettings: () => void;
  onDelete: () => void;
}

export default function HoverControls({ onSettings, onDelete }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); onSettings(); }}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-primary hover:border-primary"
          title="Settings"
        >
          <Settings size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-red-500 hover:border-red-300"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {showConfirm && (
        <DeleteConfirmModal
          onConfirm={() => { setShowConfirm(false); onDelete(); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
