import { CustomerOrder, AxisChartConfig } from '@/types';
import { buildAxisChartData } from '@/utils/chartUtils';
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, LabelList,
} from 'recharts';

interface Props {
  config: AxisChartConfig;
  orders: CustomerOrder[];
}

export default function ChartWidget({ config, orders }: Props) {
  const data = buildAxisChartData(orders, config.xAxis, config.yAxis);
  const color = config.color || '#54bd95';

  const commonProps = {
    data,
    margin: { top: 10, right: 10, left: 0, bottom: 20 },
  };

  const axisProps = {
    xAxis: <XAxis dataKey={config.xAxis} tick={{ fontSize: 11 }} />,
    yAxis: <YAxis tick={{ fontSize: 11 }} />,
    grid: <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />,
    tooltip: <Tooltip />,
  };

  const renderLabel = config.showDataLabel ? <LabelList dataKey={config.yAxis} position="top" style={{ fontSize: 10 }} /> : null;

  return (
    <div className="h-full w-full p-2">
      <p className="text-xs font-medium text-gray-500 mb-1 truncate">{config.title}</p>
      <ResponsiveContainer width="100%" height="90%">
        {config.type === 'bar' ? (
          <BarChart {...commonProps}>
            {axisProps.grid}{axisProps.xAxis}{axisProps.yAxis}{axisProps.tooltip}
            <Bar dataKey={config.yAxis} fill={color}>{renderLabel}</Bar>
          </BarChart>
        ) : config.type === 'line' ? (
          <LineChart {...commonProps}>
            {axisProps.grid}{axisProps.xAxis}{axisProps.yAxis}{axisProps.tooltip}
            <Line type="monotone" dataKey={config.yAxis} stroke={color} dot={false}>{renderLabel}</Line>
          </LineChart>
        ) : config.type === 'area' ? (
          <AreaChart {...commonProps}>
            {axisProps.grid}{axisProps.xAxis}{axisProps.yAxis}{axisProps.tooltip}
            <Area type="monotone" dataKey={config.yAxis} stroke={color} fill={`${color}33`}>{renderLabel}</Area>
          </AreaChart>
        ) : (
          <ScatterChart {...commonProps}>
            {axisProps.grid}{axisProps.xAxis}{axisProps.yAxis}{axisProps.tooltip}
            <Scatter dataKey={config.yAxis} fill={color} />
          </ScatterChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
