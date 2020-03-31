import React, { ReactElement } from 'react'
import {
  LineChart as RCLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis
} from 'recharts'

export type LineChartProps<TData> = {
  data: TData[]
  xAxisKey: keyof TData
  yAxisKey: keyof TData
  width?: number
  height?: number
}

export const LineChart: <TData>(
  props: LineChartProps<TData>
) => ReactElement<LineChartProps<TData>> = ({
  data,
  xAxisKey,
  yAxisKey,
  width = 900,
  height = 450
}) => (
  <RCLineChart width={width} height={height} data={data as any[]}>
    <Line type="monotone" dataKey={yAxisKey.toString()} stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey={xAxisKey.toString()} />
    <YAxis />
  </RCLineChart>
)
