import { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetType } from '@/types';
import WidgetRenderer from '@/components/widgets/WidgetRenderer';
import HoverControls from './HoverControls';

const ResponsiveGridLayout = WidthProvider(Responsive);
const BREAKPOINTS = { lg: 1024, md: 768, sm: 0 };
const COLS = { lg: 12, md: 8, sm: 4 };

interface Props {
  draggingType: WidgetType | null;
  onClearDragging: () => void;
}

export default function CanvasGrid({ draggingType, onClearDragging }: Props) {
  const { layout, widgets, addWidget, removeWidget, updateLayout, setActiveWidget } = useDashboardStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const widgetIds = Object.keys(widgets);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggingType) return;
    addWidget(draggingType, { x: 0, y: Infinity });
    onClearDragging();
  };

  return (
    <div
      className="flex-1 overflow-auto bg-gray-50 p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {widgetIds.length === 0 ? (
        <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-xl text-gray-400 text-sm">
          Drag widgets here to build your dashboard
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={layout}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          rowHeight={80}
          isDraggable
          isResizable
          onLayoutChange={(_, allLayouts) => {
            Object.entries(allLayouts).forEach(([bp, l]) => updateLayout(bp, l));
          }}
        >
          {widgetIds.map((id) => {
            const config = widgets[id];
            return (
              <div
                key={id}
                className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group"
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <WidgetRenderer config={config} />
                {hoveredId === id && (
                  <HoverControls
                    widgetId={id}
                    onSettings={() => setActiveWidget(id)}
                    onDelete={() => removeWidget(id)}
                  />
                )}
              </div>
            );
          })}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
