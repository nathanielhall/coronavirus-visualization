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

// type DataUsage = {
//   id: number
//   num: number
//   date: string
// }
// const usage = () => {
//   const testData = [
//     { id: 1, date: '02/3/2020', num: 30 },
//     { id: 2, date: '02/4/2020', num: 33 },
//     { id: 3, date: '02/5/2020', num: 45 },
//     { id: 4, date: '02/6/2020', num: 55 }
//   ]

//   return <LineChart data={testData} xAxisKey="num" yAxisKey="date" />
// }
