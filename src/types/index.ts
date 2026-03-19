export type DateFilterOption = 'all' | 'today' | '7d' | '30d' | '90d';
export type WidgetType = 'bar' | 'line' | 'area' | 'scatter' | 'pie' | 'table' | 'kpi';

export interface CustomerOrder {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  orderId: string;
  orderDate: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'Pending' | 'In progress' | 'Completed';
  createdBy: string;
}

export interface FilterCondition {
  field: keyof CustomerOrder;
  operator: 'equals' | 'contains' | 'gt' | 'lt';
  value: string;
}

export interface GridItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DashboardLayout {
  lg: GridItem[];
  md: GridItem[];
  sm: GridItem[];
}

export interface BaseWidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  w: number;
  h: number;
}

export interface KPIConfig extends BaseWidgetConfig {
  type: 'kpi';
  metric: keyof CustomerOrder;
  aggregation: 'Sum' | 'Average' | 'Count';
  dataFormat: 'Number' | 'Currency';
  decimalPrecision: number;
}

export interface AxisChartConfig extends BaseWidgetConfig {
  type: 'bar' | 'line' | 'area' | 'scatter';
  xAxis: string;
  yAxis: string;
  color: string;
  showDataLabel: boolean;
}

export interface PieChartConfig extends BaseWidgetConfig {
  type: 'pie';
  dataField: string;
  showLegend: boolean;
}

export interface TableConfig extends BaseWidgetConfig {
  type: 'table';
  columns: Array<keyof CustomerOrder>;
  sortBy: 'asc' | 'desc' | 'orderDate';
  pageSize: 5 | 10 | 15;
  applyFilter: boolean;
  filters: FilterCondition[];
  fontSize: number;
  headerBackground: string;
}

export type WidgetConfig = KPIConfig | AxisChartConfig | PieChartConfig | TableConfig;

export interface DashboardState {
  layout: DashboardLayout;
  widgets: Record<string, WidgetConfig>;
  savedAt: string | null;
}
