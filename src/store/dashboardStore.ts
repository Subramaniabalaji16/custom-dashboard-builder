import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  DashboardLayout,
  DateFilterOption,
  GridItem,
  WidgetConfig,
  WidgetType,
} from '@/types';
import * as dashboardApi from '@/api/dashboardApi';

const DEFAULT_WIDGET_SIZES: Record<WidgetType, { w: number; h: number }> = {
  kpi: { w: 2, h: 2 },
  bar: { w: 5, h: 5 },
  line: { w: 5, h: 5 },
  area: { w: 5, h: 5 },
  scatter: { w: 5, h: 5 },
  pie: { w: 4, h: 4 },
  table: { w: 4, h: 4 },
};

function createDefaultConfig(type: WidgetType, id: string): WidgetConfig {
  const size = DEFAULT_WIDGET_SIZES[type];
  const base = { id, type, title: 'Untitled', w: size.w, h: size.h };
  switch (type) {
    case 'kpi':
      return { ...base, type: 'kpi', metric: 'totalAmount', aggregation: 'Sum', dataFormat: 'Number', decimalPrecision: 0 };
    case 'bar':
    case 'line':
    case 'area':
    case 'scatter':
      return { ...base, type, xAxis: 'product', yAxis: 'totalAmount', color: '#54bd95', showDataLabel: false };
    case 'pie':
      return { ...base, type: 'pie', dataField: 'product', showLegend: true };
    case 'table':
      return {
        ...base, type: 'table',
        columns: ['orderId', 'product', 'quantity', 'unitPrice', 'totalAmount', 'status'],
        sortBy: 'asc', pageSize: 10, applyFilter: false, filters: [],
        fontSize: 14, headerBackground: '#54bd95',
      };
  }
}

function deriveResponsiveLayouts(lgLayout: GridItem[]): DashboardLayout {
  const sorted = [...lgLayout].sort((a, b) => a.y - b.y || a.x - b.x);

  // md: 8-col — clamp x+w to 8, reflow overflows
  const mdLayout: GridItem[] = [];
  let mdCurrentY = 0;
  for (const item of sorted) {
    const w = Math.min(item.w, 8);
    const x = Math.min(item.x, 8 - w);
    mdLayout.push({ ...item, x, w, y: mdCurrentY });
    mdCurrentY += item.h;
  }

  // sm: 4-col — all full width, stacked
  let smY = 0;
  const smLayout: GridItem[] = sorted.map((item) => {
    const entry = { ...item, x: 0, w: 4, y: smY };
    smY += item.h;
    return entry;
  });

  return { lg: lgLayout, md: mdLayout, sm: smLayout };
}

interface DashboardStore {
  layout: DashboardLayout;
  widgets: Record<string, WidgetConfig>;
  savedAt: string | null;
  activeWidgetId: string | null;
  dateFilter: DateFilterOption;
  loading: boolean;

  loadDashboard: () => Promise<void>;
  addWidget: (type: WidgetType, position: { x: number; y: number }) => void;
  removeWidget: (id: string) => void;
  updateWidgetConfig: (id: string, config: Partial<WidgetConfig>) => void;
  updateLayout: (breakpoint: string, layout: GridItem[]) => void;
  saveConfiguration: () => Promise<void>;
  setActiveWidget: (id: string | null) => void;
  setDateFilter: (filter: DateFilterOption) => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  layout: { lg: [], md: [], sm: [] },
  widgets: {},
  savedAt: null,
  activeWidgetId: null,
  dateFilter: 'all',
  loading: false,

  loadDashboard: async () => {
    set({ loading: true });
    try {
      const state = await dashboardApi.fetchDashboard();
      set({ layout: state.layout, widgets: state.widgets as Record<string, WidgetConfig>, savedAt: state.savedAt, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addWidget: (type, position) => {
    const id = uuidv4();
    const config = createDefaultConfig(type, id);
    const { w, h } = DEFAULT_WIDGET_SIZES[type];
    const newItem: GridItem = { i: id, x: position.x, y: position.y, w, h };
    set((state) => ({
      widgets: { ...state.widgets, [id]: config },
      layout: {
        ...state.layout,
        lg: [...state.layout.lg, newItem],
      },
    }));
  },

  removeWidget: (id) => {
    set((state) => {
      const widgets = { ...state.widgets };
      delete widgets[id];
      return {
        widgets,
        layout: {
          lg: state.layout.lg.filter((i) => i.i !== id),
          md: state.layout.md.filter((i) => i.i !== id),
          sm: state.layout.sm.filter((i) => i.i !== id),
        },
        activeWidgetId: state.activeWidgetId === id ? null : state.activeWidgetId,
      };
    });
  },

  updateWidgetConfig: (id, config) => {
    set((state) => ({
      widgets: {
        ...state.widgets,
        [id]: { ...state.widgets[id], ...config } as WidgetConfig,
      },
    }));
  },

  updateLayout: (breakpoint, layout) => {
    set((state) => ({
      layout: { ...state.layout, [breakpoint]: layout },
    }));
  },

  saveConfiguration: async () => {
    const { layout, widgets } = get();
    const derived = deriveResponsiveLayouts(layout.lg);
    const finalLayout = { ...derived };
    try {
      const saved = await dashboardApi.saveDashboard({ layout: finalLayout, widgets });
      set({ layout: saved.layout, widgets: saved.widgets as Record<string, WidgetConfig>, savedAt: saved.savedAt });
    } catch (error) {
      console.error('Failed to save dashboard:', error);
    }
  },

  setActiveWidget: (id) => set({ activeWidgetId: id }),
  setDateFilter: (filter) => set({ dateFilter: filter }),
}));
