import React, { ReactElement } from 'react'
import {
  LineChart as RCLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
export type LineChartProps<TData> = {
  data: TData[]
  xAxisKey: keyof TData
  yAxisKey: keyof TData
}

export const LineChart: <TData>(
  props: LineChartProps<TData>
) => ReactElement<LineChartProps<TData>> = ({ data, xAxisKey, yAxisKey }) => (
  <ResponsiveContainer width={'100%'} aspect={4.0 / 1.25}>
    <RCLineChart data={data as any[]}>
      <Line type="monotone" dataKey={yAxisKey.toString()} stroke="#8884d8" />

      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey={xAxisKey.toString()} />
      <Tooltip />
      <YAxis />
    </RCLineChart>
  </ResponsiveContainer>
)
