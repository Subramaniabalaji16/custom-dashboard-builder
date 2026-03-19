import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardStore } from '@/store/dashboardStore';
import WidgetRenderer from '@/components/widgets/WidgetRenderer';

const ResponsiveGridLayout = WidthProvider(Responsive);

const BREAKPOINTS = { lg: 1024, md: 768, sm: 0 };
const COLS = { lg: 12, md: 8, sm: 4 };

interface Props {
  editable?: boolean;
}

export default function WidgetGrid({ editable = false }: Props) {
  const { layout, widgets, updateLayout } = useDashboardStore();

  const widgetIds = Object.keys(widgets);
  if (widgetIds.length === 0) return null;

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layout}
      breakpoints={BREAKPOINTS}
      cols={COLS}
      rowHeight={80}
      isDraggable={editable}
      isResizable={editable}
      onLayoutChange={(currentLayout, allLayouts) => {
        if (editable) {
          Object.entries(allLayouts).forEach(([bp, l]) => updateLayout(bp, l));
        }
      }}
    >
      {widgetIds.map((id) => {
        const config = widgets[id];
        const lgItem = layout.lg.find((i) => i.i === id);
        if (!lgItem) return null;
        return (
          <div key={id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <WidgetRenderer config={config} />
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
}
