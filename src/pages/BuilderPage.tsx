import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetType } from '@/types';
import WidgetPanel from '@/components/builder/WidgetPanel';
import CanvasGrid from '@/components/builder/CanvasGrid';
import SettingsPanel from '@/components/settings/SettingsPanel';

export default function BuilderPage() {
  const navigate = useNavigate();
  const { saveConfiguration, activeWidgetId } = useDashboardStore();
  const [draggingType, setDraggingType] = useState<WidgetType | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await saveConfiguration();
    setSaving(false);
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
            <ArrowLeft size={16} /> Back
          </button>
          <span className="text-gray-300">|</span>
          <h1 className="text-base font-semibold text-gray-800">Configure Dashboard</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          <Save size={15} /> {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <WidgetPanel onDragStart={setDraggingType} />
        <CanvasGrid draggingType={draggingType} onClearDragging={() => setDraggingType(null)} />
        {activeWidgetId && <SettingsPanel />}
      </div>
    </div>
  );
}
